/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatGroq } from "@langchain/groq";
import { ChatMessageHistory  } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder  } from '@langchain/core/prompts'
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BufferWindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { removeIndentation } from "../util/string-util";
import ChatMemory from "../model/chat-memory";
import config from "../config";

const groqApiKey = config.groqApiKey;
const model = 'llama3-8b-8192';

const llm = new ChatGroq({
    apiKey: groqApiKey,
    modelName: model,
    temperature: 1.0
});

const systemPrompt = removeIndentation(`
    Kamu adalah Alisya personal chat WhatsApp muslimah.
    Kamu berbicara dengan sopan serta ramah dengan bahasa tidak formal seperti kata "aku" dibandingkan "anda", 
    serta terkadang memberi emoji untuk menunjukkan emosi.
`).replace("\n", "");

const makeConversationChain = async (id: string) => {
    const chatMemory = await ChatMemory.findByPk(id);
    let chatHistory = new ChatMessageHistory();

    if (chatMemory) {
        const history = JSON.parse(chatMemory.history);
        chatHistory = new ChatMessageHistory(history.map((message: any) => {
            if (message.type === "ai") {
                return new AIMessage(message.data.content);
            } else {
                return new HumanMessage(message.data.content);
            }
        }))
    }

    const memory = new BufferWindowMemory({
        k: 25,
        memoryKey: "chatHistory",
        chatHistory: chatHistory,
        returnMessages: true
    })
    
    const prompt = new ChatPromptTemplate({
        promptMessages: [
            new SystemMessage(systemPrompt),
            new MessagesPlaceholder("chatHistory"),
            HumanMessagePromptTemplate.fromTemplate("{inputText}"),
        ],
        inputVariables: ["inputText", "chatHistory"],
    })
    
    const chain = new ConversationChain({ 
        llm,
        prompt: prompt,
        memory: memory
    });

    return { chain, memory };
}

const updateChatMemory = async (id: string, memory: BufferWindowMemory): Promise<boolean> => {
    try {
        const messageHistory = await memory.chatHistory.getMessages();
        const messageHistoryDict = messageHistory.map((message) => message.toDict());

        const [chatMemory, created] = await ChatMemory.findOrCreate({ 
            where: {
                id
            },
            defaults: {
                history: JSON.stringify(messageHistoryDict)
            }
        })

        if (!created) {
            chatMemory.history = JSON.stringify(messageHistoryDict);
            await chatMemory.save();
        }

        return true;
    } catch (error) {
        return false;
    }
}

const responseUserMessage = async (id: string, message: string): Promise<string> => {
    const { chain, memory } = await makeConversationChain(id);
    const chainValue = await chain.call({ inputText: message })
    updateChatMemory(id, memory);    
    return chainValue.response;
}

export {
    responseUserMessage
}
