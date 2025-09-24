import dotenv from 'dotenv';
dotenv.config();

type ConfigType = {
  chiperKey: string;
  llmApiKey: string;
  chromaDbUrl: string;
  chromaCollectionName: string;
};

const config: ConfigType = {
  chiperKey: process.env.CHIPER_KEY!,
  llmApiKey: process.env.LLM_API_KEY!,
  chromaDbUrl: process.env.CHROMA_DB_URL || 'http://localhost:8000',
  chromaCollectionName: process.env.CHROMA_COLLECTION_NAME || 'alisya-memory',
};

export default config;
