import dotenv from 'dotenv';
dotenv.config();

type ConfigType = {
  devmode: boolean;
  chiperKey: string;
  llmApiKey: string;
  chromadbUrl: string;
};

const config: ConfigType = {
  devmode: process.env.DEV_MODE === 'true',
  chiperKey: process.env.CHIPER_KEY!,
  llmApiKey: process.env.LLM_API_KEY!,
  chromadbUrl: process.env.CHROMA_DB_URL || 'http://localhost:8000',
};

export default config;
