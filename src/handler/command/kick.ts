import { GroupChat, Message } from "whatsapp-web.js"
import { filterAdminInvoked } from "../../util/command-util"
import logger from "../../logger/pino"
import { parseStackTrace } from "../../util/string-util"

const kickFromGroup = async (message: Message) => {
    try {
        const chat = await message.getChat()
        let groupChat: GroupChat

        logger.info("ACTION: Kick From Group")

        if (filterAdminInvoked(chat, message)) {
            logger.warn("Command requirement not met! exiting...")
            return
        } else {
            groupChat = chat as GroupChat
        }

        if (message.mentionedIds.length === 0) {
            logger.warn("No mentioned user to kick!")
            message.reply("Silahkan tag orangnya *!kick [@tagOrangnya]*")
            return
        }

        logger.info({
            message: "Kicking participants from group!",
            participants: message.mentionedIds,
        })
        await groupChat.removeParticipants(message.mentionedIds.map(id => id.toString()))
        logger.info("Success kicking participants from group!")
        message.reply("Berhasil mengeluarkan anggota dari group!")
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to kick participants from group!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Yah.. sepertinya aku gagal mengeluarkan anggota dari group 😢")
    }
}

export default kickFromGroup
