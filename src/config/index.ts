import dotenv from 'dotenv';
dotenv.config();

type ConfigType = {
  devmode: boolean;
  chiperKey: string;
  llmApiKey: string;
  chromadbUrl: string;
  chromiumPath: string | undefined;
};

const config: ConfigType = {
  devmode: process.env.DEV_MODE === 'true',
  chiperKey: process.env.CHIPER_KEY!,
  llmApiKey: process.env.LLM_API_KEY!,
  chromadbUrl: process.env.CHROMA_DB_URL || 'http://localhost:8000',
  chromiumPath: process.env.CHROMIUM_PATH
};

export default config;
