/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const googleApiKey = config.llmApiKey;

export const llm = new ChatGoogleGenerativeAI({
    apiKey: googleApiKey,
    model: "gemini-2.0-flash",
    temperature: 0.7
});

