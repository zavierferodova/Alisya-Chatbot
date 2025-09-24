import { GroupChat, Message } from "whatsapp-web.js"
import { resetChatMemory } from "../../core/chain"
import { sha256KeyedHash } from "../../util/crypto-util"
import config from "../../config"
import logger from "../../logger/pino"

const resetMemory = async (message: Message) => {
    try {
        const chat = await message.getChat()
        let id = ""

        logger.info("ACTION: Reset memory")

        if (chat.isGroup) {
            const groupChat = chat as GroupChat
            id = groupChat.id._serialized + message.author
        } else {
            id = message.from
        }

        logger.info("Resetting chat memory ...")

        const encryptedId = sha256KeyedHash(config.chiperKey, id)
        const result = await resetChatMemory(encryptedId)
        if (result) {
            logger.info("Success resetting chat memory!")
            message.reply("Memory pembicaraan berhasil direset!")
        } else {
            logger.warn("Failed resetting chat memory!")
            message.reply("Memory gagal direset!")
        }
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to reset chat memory!",
            error: err.message,
        })
        message.reply("Maaf ya sepertinya sistemku sedang mengalami gangguan 😢")
    }
}

export default resetMemory
