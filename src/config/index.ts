import dotenv from 'dotenv'
dotenv.config()

type ConfigType = {
    chiperKey: string;
    llmApiKey: string;
}

const config: ConfigType = {
    chiperKey: process.env.CHIPER_KEY!,
    llmApiKey: process.env.LLM_API_KEY!
}

export default config
