/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatGroq } from "@langchain/groq"
import { ChatMessageHistory  } from 'langchain/memory'
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { BufferWindowMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"
import { removeIndentation } from "../util/string-util"
import ChatMemory from "../model/chat-memory"
import config from "../config"
import botConfig from "../config/bot-config"
import TakeOverMemory from "../model/takeover-memory"

const groqApiKey = config.groqApiKey
const model = 'llama3-8b-8192'
const systemPrompt = removeIndentation(botConfig.personalizePrompt).replace("\n", "")
const systemPromptTakeOver = removeIndentation(botConfig.personalizePromptTakeOver).replace("\n", "")

const llm = new ChatGroq({
    apiKey: groqApiKey,
    modelName: model,
    temperature: 1.0
})

const makeConversationChain = async (id: string) => {
    const chatMemory = await ChatMemory.findByPk(id)
    let chatHistory = new ChatMessageHistory()

    if (chatMemory) {
        const history = JSON.parse(chatMemory.history)
        chatHistory = new ChatMessageHistory(history.map((message: any) => {
            if (message.type === "ai") {
                return new AIMessage(message.data.content)
            } else {
                return new HumanMessage(message.data.content)
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
    })

    return { chain, memory }
}

const makeTakeOverConversationChain = async (id: string, ownerName: string) => {
    const chatMemory = await TakeOverMemory.findByPk(id)
    let chatHistory = new ChatMessageHistory()

    if (chatMemory) {
        const history = JSON.parse(chatMemory.history)
        chatHistory = new ChatMessageHistory(history.map((message: any) => {
            if (message.type === "ai") {
                return new AIMessage(message.data.content)
            } else {
                return new HumanMessage(message.data.content)
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
            new SystemMessage(systemPromptTakeOver.replace("{{ownerName}}", ownerName)),
            new MessagesPlaceholder("chatHistory"),
            HumanMessagePromptTemplate.fromTemplate("{inputText}"),
        ],
        inputVariables: ["inputText", "chatHistory"],
    })
    
    const chain = new ConversationChain({ 
        llm,
        prompt: prompt,
        memory: memory
    })

    return { chain, memory }
}

const updateChatMemory = async (id: string, memory: BufferWindowMemory): Promise<boolean> => {
    try {
        const messageHistory = await memory.chatHistory.getMessages()
        const messageHistoryDict = messageHistory.map((message) => message.toDict())

        const [chatMemory, created] = await ChatMemory.findOrCreate({ 
            where: {
                id
            },
            defaults: {
                history: JSON.stringify(messageHistoryDict)
            }
        })

        if (!created) {
            chatMemory.history = JSON.stringify(messageHistoryDict)
            await chatMemory.save()
        }

        return true
    } catch (error) {
        return false
    }
}

const resetChatMemory = async (id: string): Promise<boolean> => {
    try {
        const chatMemory = await ChatMemory.findByPk(id)
        
        if (chatMemory) {
            await chatMemory.destroy()
            return true
        }
    
        return false
    } catch (error) {
        return false
    }
}

const updateTakeOverMemory = async (id: string, memory: BufferWindowMemory): Promise<boolean> => {
    try {
        const messageHistory = await memory.chatHistory.getMessages()
        const messageHistoryDict = messageHistory.map((message) => message.toDict())

        const [chatMemory, created] = await TakeOverMemory.findOrCreate({ 
            where: {
                id
            },
            defaults: {
                history: JSON.stringify(messageHistoryDict)
            }
        })

        if (!created) {
            chatMemory.history = JSON.stringify(messageHistoryDict)
            await chatMemory.save()
        }

        return true
    } catch (error) {
        return false
    }
}

const resetAllTakeOverMemory = async (): Promise<boolean> => {
    try {
        await TakeOverMemory.destroy({
            where: {}
        })

        return true
    } catch (error) {
        return false
    }
}

const isTakeOverMemoryEmpty = async (id: string): Promise<boolean> => {
    try {
        const chatMemory = await TakeOverMemory.findByPk(id)
        if (chatMemory && chatMemory.history.length > 0) {
            return false
        }

        return true
    } catch (error) {
        return true
    }
}

type ResponseUserMessageOptions = {
    takeOver: boolean,
    ownerName?: string
}

const responseUserMessage = async (
    id: string,
    message: string,
    options: ResponseUserMessageOptions | undefined = {
        takeOver: false
    }
): Promise<string> => {
    let conversationChain: ConversationChain
    let chatMemory: BufferWindowMemory

    if (!options.takeOver) {
        const { chain, memory } = await makeConversationChain(id)
        conversationChain = chain
        chatMemory = memory
    } else {
        const { chain, memory } = await makeTakeOverConversationChain(id, options.ownerName || "")
        conversationChain = chain
        chatMemory = memory
    }

    const chainValue = await conversationChain.call({ 
        inputText: removeIndentation(`Date: ${new Date().toISOString()}\n\n${message}`)
    })

    if (!options.takeOver) {
        updateChatMemory(id, chatMemory)
    } else {
        updateTakeOverMemory(id, chatMemory)
    }

    return chainValue.response
}

export {
    responseUserMessage,
    resetChatMemory,
    resetAllTakeOverMemory,
    isTakeOverMemoryEmpty
}
