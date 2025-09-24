import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { removeIndentation } from '../util/string-util';
import { embeddings, llm } from '../llm/genai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { ConversationChain } from 'langchain/chains';
import botConfig from '../config/bot-config';
import config from '../config';

const systemPrompt = removeIndentation(botConfig.personalizePrompt).replace('\n', '');
const systemPromptTakeOver = removeIndentation(botConfig.personalizePromptTakeOver).replace(
  '\n',
  '',
);

const chatVectorStore = new Chroma(embeddings, {
  collectionName: 'alisya-chat-memory',
  url: config.chromaDbUrl,
});

const takeOverVectorStore = new Chroma(embeddings, {
  collectionName: 'alisya-takeover-memory',
  url: config.chromaDbUrl,
});

/**
 * Creates a conversation chain for a standard user chat.
 * It loads history and summary from the database to resume conversations.
 */
const makeConversationChain = async (id: string) => {
  const memory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: chatVectorStore.asRetriever({
      k: 10,
      filter: {
        from: id,
      },
    }),
    memoryKey: 'chatHistory',
    metadata: {
      from: id,
    },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `${systemPrompt}\n\nBerikut adalah konteks dari percakapan sebelumnya:\n{chatHistory}`,
    ],
    ['human', '{inputText}'],
  ]);

  const chain = new ConversationChain({
    llm,
    prompt,
    memory,
    verbose: true,
  });

  return { chain, memory };
};

/**
 * Creates a conversation chain for a take over chat.
 * It loads history and summary from the database to resume conversations.
 */
const makeTakeOverChain = async (id: string, ownerName: string) => {
  const memory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: takeOverVectorStore.asRetriever({
      k: 10,
      filter: {
        from: id,
      },
    }),
    memoryKey: 'chatHistory',
    metadata: {
      from: id,
    },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `${systemPromptTakeOver.replace('{{ownerName}}', ownerName)}\n\nBerikut adalah konteks dari percakapan sebelumnya:\n{chatHistory}`,
    ],
    ['human', '{inputText}'],
  ]);

  const chain = new ConversationChain({
    llm,
    prompt,
    memory,
    verbose: true,
  });

  return { chain, memory };
};

/**
 * Main function to handle an incoming user message and get a response.
 */
export const responseUserMessage = async (
  id: string,
  message: string,
  options: { takeOver: boolean; ownerName?: string } = { takeOver: false },
): Promise<string> => {
  let conversationChain;

  if (options.takeOver) {
    const { chain } = await makeTakeOverChain(id, options.ownerName || '');
    conversationChain = chain;
  } else {
    const { chain } = await makeConversationChain(id);
    conversationChain = chain;
  }

  const chainValue = await conversationChain.invoke({
    inputText: removeIndentation(`${message}`),
  });

  const chainValueString = chainValue.response as string;
  return chainValueString;
};

/**
 * Deletes a user's chat history from the database.
 */
export const resetChatMemory = async (id: string): Promise<boolean> => {
  await chatVectorStore.delete({ filter: { from: id } });
  return true;
};

/**
 * Deletes all "take over" chat histories from the vector store.
 */
export const resetAllTakeOverMemory = async (): Promise<boolean> => {
  try {
    // 1. Get all documents from the collection
    const allDocs = await takeOverVectorStore.collection?.get();

    // 2. If there are documents, delete them by their IDs
    if (allDocs && allDocs.ids.length > 0) {
      await takeOverVectorStore.delete({ ids: allDocs.ids });
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a "take over" memory record is empty for a specific ID.
 */
export const isTakeOverMemoryEmpty = async (id: string): Promise<boolean> => {
  // Search for just 1 document matching the filter.
  // If the result array is empty, then no memory exists.
  const results = await takeOverVectorStore.similaritySearch(' ', 1, {
    from: id,
  });

  return results.length === 0;
};
