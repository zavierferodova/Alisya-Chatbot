import { GroupChat, Message } from "whatsapp-web.js"
import { responseUserMessage } from "../../core/chain"
import { messageCommands } from "../registration"
import { sha256KeyedHash } from "../../util/crypto-util"
import config from "../../config"
import logger from "../../logger/pino"
import { parseStackTrace } from "../../util/string-util"

const talk = async (message: Message) => {
    try {
        logger.info("ACTION: Talk")

        const msgx = message.body.trim()
        const chat = await message.getChat()
        let id = ""

        if (chat.isGroup) {
            const groupChat = chat as GroupChat
            id = groupChat.id._serialized + message.author
        } else {
            id = message.from
        }

        logger.info("Getting llm response ...")
        const encryptedId = sha256KeyedHash(config.chiperKey, id)
        const userQuestion = msgx.replace(messageCommands.talk.prefix, '').trim()
        const response = await responseUserMessage(encryptedId, userQuestion)
        logger.info("Success getting llm response!")
        message.reply(response)
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to get llm response!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Maaf ya sepertinya sistemku sedang mengalami gangguan 😢")
    }
}

export default talk
