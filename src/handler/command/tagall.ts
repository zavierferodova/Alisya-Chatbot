import { GroupChat, Message } from 'whatsapp-web.js';
import client from '../../worker/client';
import { filterGroupInvoked } from '../../util/command-util';
import logger from '../../logger/pino';
import { parseStackTrace } from '../../util/string-util';

const tagAll = async (message: Message) => {
  try {
    const chat = await message.getChat();

    logger.info('ACTION: Tag All');

    if (filterGroupInvoked(chat, message)) {
      logger.warn('Command requirement not met! exiting...');
      return;
    }

    const groupChat = chat as GroupChat;
    const participants = groupChat.participants;
    const mentions = [];
    let text = '';

    logger.info('Getting participants contact in group ...');

    for (const participant of participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    logger.info({
      message: 'Tagging all participants in group ...',
      participants: participants
    });
    await chat.sendMessage(text, { mentions: mentions.map((contact) => contact.id._serialized) });
    logger.info('Success tagging all participants in group!');
  } catch (error) {
    const err = error as Error;
    logger.error({
      message: 'Failed to tag all participants in group!',
      error: parseStackTrace(err.stack)
    });
    message.reply('Yah.. sepertinya aku gagal melakukan tag 😢');
  }
};

export default tagAll;
