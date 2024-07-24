import { Message, MessageMedia } from "whatsapp-web.js";
import logger from "../../logger/pino";
import { parseStackTrace } from "../../util/string-util";

const stickerize = async (message: Message) => {
    try {
        logger.info("ACTION: Stickerize");

        const chat = await message.getChat()

        if (message.hasMedia) {
            logger.info("Downloading media...")
            const media: MessageMedia = await message.downloadMedia();
            if (media.mimetype.startsWith('image/')) {
                logger.info("Sending sticker...")
                chat.sendMessage(media, {
                    sendMediaAsSticker: true,
                    stickerAuthor: "Yang buat Alisya 😎"
                })
            } else {
                logger.warn("Media is not an image!")
                message.reply("Sepertinya yang kamu kirim bukan gambar 😢")
            }
        }
    } catch (error) {
        const err = error as Error;
        logger.error({
            message: "Failed to create sticker!",
            error: parseStackTrace(err.stack),
        });
        message.reply("Yah.. sepertinya aku gagal membuat sticker 😢")
    }
}

export default stickerize;
