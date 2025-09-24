/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessageHistory, ConversationSummaryBufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ConversationChain } from "langchain/chains";
import { removeIndentation } from "../util/string-util";
import { llm } from "../llm/genai";

import ChatMemory from "../model/chat-memory";
import TakeOverMemory from "../model/takeover-memory";
import botConfig from "../config/bot-config";

const systemPrompt = removeIndentation(botConfig.personalizePrompt).replace("\n", "");
const systemPromptTakeOver = removeIndentation(botConfig.personalizePromptTakeOver).replace("\n", "");

/**
 * Creates a conversation chain for a standard user chat.
 * It loads history and summary from the database to resume conversations.
 */
const makeConversationChain = async (id: string) => {
    const chatMemoryRecord = await ChatMemory.findByPk(id);
    let chatHistory = new ChatMessageHistory();
    let summary = "";

    if (chatMemoryRecord) {
        const history = JSON.parse(chatMemoryRecord.history);
        chatHistory = new ChatMessageHistory(history.map((message: any) => {
            return message.type === "ai"
                ? new AIMessage(message.data.content)
                : new HumanMessage(message.data.content);
        }));
        summary = chatMemoryRecord.summary || "";
    }

    const memory = new ConversationSummaryBufferMemory({
        llm,
        chatHistory,
        maxTokenLimit: 6000,
        memoryKey: "chatHistory",
        returnMessages: true,
        summaryChatMessageClass: HumanMessage
    });
    memory.movingSummaryBuffer = summary; // Load the saved summary

    const prompt = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemPrompt),
        new MessagesPlaceholder("chatHistory"),
        HumanMessagePromptTemplate.fromTemplate("{inputText}"),
    ]);
    
    const chain = new ConversationChain({ 
        llm,
        prompt,
        memory,
    });

    return { chain, memory };
};

/**
 * Creates a conversation chain for a "take over" chat scenario.
 */
const makeTakeOverConversationChain = async (id: string, ownerName: string) => {
    const chatMemoryRecord = await TakeOverMemory.findByPk(id);
    let chatHistory = new ChatMessageHistory();
    let summary = "";

    if (chatMemoryRecord) {
        const history = JSON.parse(chatMemoryRecord.history);
        chatHistory = new ChatMessageHistory(history.map((message: any) => {
            return message.type === "ai"
                ? new AIMessage(message.data.content)
                : new HumanMessage(message.data.content);
        }));
        summary = chatMemoryRecord.summary || "";
    }

    const memory = new ConversationSummaryBufferMemory({
        llm,
        chatHistory,
        maxTokenLimit: 6000,
        memoryKey: "chatHistory",
        returnMessages: true,
        summaryChatMessageClass: HumanMessage
    });
    memory.movingSummaryBuffer = summary; // Load the saved summary

    const prompt = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemPromptTakeOver.replace("{{ownerName}}", ownerName)),
        new MessagesPlaceholder("chatHistory"),
        HumanMessagePromptTemplate.fromTemplate("{inputText}"),
    ]);
    
    const chain = new ConversationChain({ 
        llm,
        prompt,
        memory,
    });

    return { chain, memory };
};

/**
 * Saves the updated message buffer and summary to the database.
 */
const updateChatMemory = async (id: string, memory: ConversationSummaryBufferMemory): Promise<boolean> => {
    try {
        const messageHistory = await memory.chatHistory.getMessages();
        const summary = memory.movingSummaryBuffer;
        const messageHistoryDict = messageHistory.map((message) => message.toDict());

        const [chatMemory, created] = await ChatMemory.findOrCreate({ 
            where: { id },
            defaults: { 
                history: JSON.stringify(messageHistoryDict),
                summary: summary
            }
        });

        if (!created) {
            chatMemory.history = JSON.stringify(messageHistoryDict);
            chatMemory.summary = summary;
            await chatMemory.save();
        }
        return true;
    } catch (error) {
        console.error("Failed to update chat memory:", error);
        return false;
    }
};

/**
 * Saves the state of a "take over" chat.
 */
const updateTakeOverMemory = async (id: string, memory: ConversationSummaryBufferMemory): Promise<boolean> => {
    try {
        const messageHistory = await memory.chatHistory.getMessages();
        const summary = memory.movingSummaryBuffer;
        const messageHistoryDict = messageHistory.map((message) => message.toDict());

        const [chatMemory, created] = await TakeOverMemory.findOrCreate({ 
            where: { id },
            defaults: { 
                history: JSON.stringify(messageHistoryDict),
                summary: summary
            }
        });

        if (!created) {
            chatMemory.history = JSON.stringify(messageHistoryDict);
            chatMemory.summary = summary;
            await chatMemory.save();
        }
        return true;
    } catch (error) {
        console.error("Failed to update take over memory:", error);
        return false;
    }
};

/**
 * Main function to handle an incoming user message and get a response.
 */
export const responseUserMessage = async (
    id: string,
    message: string,
    options: { takeOver: boolean, ownerName?: string } = { takeOver: false }
): Promise<string> => {
    let conversationChain: ConversationChain;
    let chatMemory: ConversationSummaryBufferMemory;

    if (!options.takeOver) {
        const { chain, memory } = await makeConversationChain(id);
        conversationChain = chain;
        chatMemory = memory;
    } else {
        const { chain, memory } = await makeTakeOverConversationChain(id, options.ownerName || "");
        conversationChain = chain;
        chatMemory = memory;
    }

    const chainValue = await conversationChain.invoke({ 
        inputText: removeIndentation(`Date: ${new Date().toISOString()}\n\n${message}`)
    });

    if (!options.takeOver) {
        await updateChatMemory(id, chatMemory);
    } else {
        await updateTakeOverMemory(id, chatMemory);
    }

    return chainValue.response as string;
};

/**
 * Deletes a user's chat history from the database.
 */
export const resetChatMemory = async (id: string): Promise<boolean> => {
    const chatMemory = await ChatMemory.findByPk(id);
    if (chatMemory) {
        await chatMemory.destroy();
        return true;
    }
    return false;
};

/**
 * Deletes all "take over" chat histories from the database.
 */
export const resetAllTakeOverMemory = async (): Promise<boolean> => {
    await TakeOverMemory.destroy({ where: {} });
    return true;
};

/**
 * Checks if a "take over" memory record is empty.
 */
export const isTakeOverMemoryEmpty = async (id: string): Promise<boolean> => {
    const chatMemory = await TakeOverMemory.findByPk(id);
    // An empty history is typically stored as '[]' which has a length of 2.
    return !chatMemory || chatMemory.history.length <= 2;
};