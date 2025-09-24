import { GroupChat, Message } from 'whatsapp-web.js';
import { extractGroupPhones } from '../../util/group-util';
import client from '../../worker/client';
import logger from '../../logger/pino';
import { parseStackTrace } from '../../util/string-util';
import { filterAdminInvoked } from '../../util/command-util';

const addToGroup = async (message: Message) => {
  try {
    const chat = await message.getChat();
    const msgx = message.body;
    let groupChat: GroupChat;

    logger.info('ACTION: Add to Group');

    if (filterAdminInvoked(chat, message)) {
      logger.warn('Command requirement not met! exiting...');
      return;
    } else {
      groupChat = chat as GroupChat;
    }

    const existingParticipants = extractGroupPhones(groupChat);
    const phoneToAdd = msgx.split(/\D+/).filter(Boolean);
    const requestToAdd = [];
    const failedToAdd = [];
    const alreadyInGroup = [];

    logger.info({
      message: 'Checking phone numbers to add into group!',
      phones: phoneToAdd,
    });

    for (const phone of phoneToAdd) {
      if (existingParticipants.has(phone)) {
        alreadyInGroup.push(phone);
      } else {
        const isRegistered = await client.isRegisteredUser(phone + '@c.us');
        if (isRegistered) {
          const contact = await client.getContactById(phone + '@c.us');
          const idnmr = contact.id._serialized;
          requestToAdd.push(idnmr);
        } else {
          failedToAdd.push(phone);
        }
      }
    }

    if (failedToAdd.length > 0) {
      logger.info({
        message: 'List not registered phone numbers!',
        participants: failedToAdd,
      });
      message.reply(
        'Nomor berikut tidak terdaftar di WhatsApp: ' + failedToAdd.toString().replace(/,/g, ' '),
      );
    }

    if (alreadyInGroup.length > 0) {
      logger.info({
        message: 'List phone numbers already in group!',
        participants: alreadyInGroup,
      });
      message.reply(
        'Nomor berikut sudah ada di group: ' + failedToAdd.toString().replace(/,/g, ' '),
      );
    }

    if (requestToAdd.length > 0) {
      logger.info({
        message: 'Adding participants to group...',
        participants: requestToAdd,
      });
      await groupChat.addParticipants(requestToAdd);
      logger.info('Success add participants to group!');
    } else {
      logger.warn('No phone numbers to add into group!');
      message.reply('Maaf, tidak ada nomor yang bisa ditambahkan ke group 😢');
    }
  } catch (error) {
    const err = error as Error;
    logger.error({
      message: 'Failed to add participants to group!',
      error: parseStackTrace(err.stack),
    });
    message.reply('Yah.. sepertinya aku gagal menambahkan anggota ke group 😢');
  }
};

export default addToGroup;
