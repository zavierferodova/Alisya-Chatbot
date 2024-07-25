import dotenv from 'dotenv'
dotenv.config()

type ConfigType = {
    chiperKey: string;
    groqApiKey: string;
}

const config: ConfigType = {
    chiperKey: process.env.CHIPER_KEY!,
    groqApiKey: process.env.GROQ_API_KEY!
}

export default config
