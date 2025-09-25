import { Message, MessageMedia } from 'whatsapp-web.js';
import { parseStackTrace, removeIndentation } from '../../util/string-util';
import logger from '../../logger/pino';
import client from '../../worker/client';
import botConfig from '../../config/personalization';

const forward = async (message: Message) => {
  try {
    const msgx = message.body;
    const msgArray = msgx.trim().split(' ');
    const phone = msgArray.length > 1 ? msgArray[1] : '';
    const messageToForward =
      msgArray.length > 2 ? msgArray.filter((value, index) => index > 1).join(' ') : '';

    logger.info('ACTION: Forwarding message to another number');

    if (!phone) {
      logger.warn('Phone number is not provided! exiting...');
      message.reply('Silahkan masukkan nomor telepon untuk meneruskan pesan!');
    }

    logger.info(`Checking if the number ${phone} is registered on WhatsApp ...`);

    const phoneId = `${phone}@c.us`;
    const isRegistered = await client.isRegisteredUser(phoneId);

    if (isRegistered) {
      logger.info(`Phone number ${phone} is registered on WhatsApp! Forwarding message ...`);

      let media: MessageMedia | undefined;
      if (message.hasMedia) {
        media = await message.downloadMedia();
      }

      const makeMessage = removeIndentation(
        `Halo aku ${botConfig.name} personal WhatsApp Chatbot kamu dapat pesan nih dari seseorang:\n
                ${messageToForward}`
      );

      await client.sendMessage(phoneId, makeMessage, {
        media: media
      });
      await message.reply('Pesan berhasil diteruskan!');

      logger.info(`Success forwarding message to ${phone}`);
    } else {
      logger.warn(`Phone number ${phone} is not registered on WhatsApp!`);
      message.reply(`Maaf, nomor ${phone} tidak terdaftar pada WhatsApp`);
    }
  } catch (error) {
    const err = error as Error;
    logger.error({
      message: 'Failed to forward message!',
      error: parseStackTrace(err.stack)
    });
    message.reply('Yah.. sepertinya aku gagal meneruskan pesan 😢');
  }
};

export default forward;
