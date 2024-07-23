import { Message, MessageMedia } from "whatsapp-web.js";

const stickerize = async (message: Message) => {
    try {
        const chat = await message.getChat()

        if (message.hasMedia) {
            const media: MessageMedia = await message.downloadMedia();
            if (media.mimetype.startsWith('image/')) {
                chat.sendMessage(media, {
                    sendMediaAsSticker: true,
                    stickerAuthor: "Yang buat Alisya 😎"
                })
            } else {
                message.reply("Sepertinya yang kamu kirim bukan gambar :(")
            }
        }
    } catch (error) {
        console.error("[stickerize]", error)
        message.reply("Yah.. sepertinya aku gagal membuat sticker :(")
    }
}

export default stickerize;
