import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { removeIndentation } from '../util/string-util';
import { embeddings, llm } from '../llm/genai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import botConfig from '../config/personalization';
import config from '../config';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import logger from '../logger/pino';

const systemPrompt = removeIndentation(botConfig.personalizePrompt).replace('\n', '');
const systemPromptTakeOver = removeIndentation(botConfig.personalizePromptTakeOver).replace(
  '\n',
  ''
);

const chatVectorStore = new Chroma(embeddings, {
  collectionName: 'alisya-chat-memory',
  url: config.chromadbUrl
});

const takeOverVectorStore = new Chroma(embeddings, {
  collectionName: 'alisya-takeover-memory',
  url: config.chromadbUrl
});

const getConversationMemory = async (id: string) => {
  const memory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: chatVectorStore.asRetriever({
      k: 8,
      filter: {
        from: id
      }
    }),
    metadata: {
      from: id
    }
  });

  return memory;
};

const getTakeOverMemory = async (id: string) => {
  const memory = new VectorStoreRetrieverMemory({
    vectorStoreRetriever: takeOverVectorStore.asRetriever({
      k: 8,
      filter: {
        from: id
      }
    }),
    metadata: {
      from: id
    }
  });

  return memory;
};

type ResponseUserMessageParams = {
  id: string;
  message: string;
  image?: string;
  options: { takeOver: boolean; ownerName?: string };
};

/**
 * Main function to handle an incoming user message and get a response.
 */
export const responseUserMessage = async ({
  id,
  message,
  image,
  options
}: ResponseUserMessageParams): Promise<string> => {
  let memory: VectorStoreRetrieverMemory;

  if (options.takeOver) {
    memory = await getTakeOverMemory(id);
  } else {
    memory = await getConversationMemory(id);
  }

  const memoryVariables = await memory.loadMemoryVariables({
    input: message
  });
  const chatMemory = memoryVariables.memory ? memoryVariables.memory : '';
  const systemMessage = options.takeOver
    ? removeIndentation(systemPromptTakeOver.replace('{ownerName}', options.ownerName || '')) +
      '\n' +
      chatMemory
    : removeIndentation(systemPrompt) + '\n' + chatMemory;

  const messages = [
    new SystemMessage(systemMessage),
    new HumanMessage({
      content: image
        ? [
            {
              type: 'text',
              text: removeIndentation(`${message}`)
            },
            {
              type: 'image_url',
              image_url: image
            }
          ]
        : [
            {
              type: 'text',
              text: removeIndentation(`${message}`)
            }
          ]
    })
  ];

  const response = await llm.invoke(messages);
  const responseString = response.text;
  await memory.saveContext(
    {
      input: message + (image ? ` 1 image attached` : '')
    },
    {
      output: responseString
    }
  );

  if (config.devmode) {
    logger.info({
      memory: chatMemory,
      response: responseString
    });
  }

  return responseString;
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
    from: id
  });

  return results.length === 0;
};
