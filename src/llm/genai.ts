import config from "../config";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const googleApiKey = config.llmApiKey;

export const llm = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: "gemini-2.0-flash",
    temperature: 0.7
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: googleApiKey,
    model: "gemini-embedding-001",
});
