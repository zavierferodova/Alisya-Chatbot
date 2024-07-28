import { Message } from "whatsapp-web.js"
import { parseStackTrace } from "../../util/string-util"
import logger from "../../logger/pino"
import { updatePublicFunctionState } from "../../util/state-util"
import client from "../../worker/client"

const enablePublicFunctions = async (message: Message) => {
    try {
        logger.info("ACTION: Enable Public Functions")

        const currentId = message.author
        const botId = client.info.wid._serialized

        if (currentId == botId) {
            await updatePublicFunctionState(true)
            await message.reply("Fungsi publik diaktifkan!")
            logger.info("Success enabling public functions!")
        }
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to activate public functions!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Gagal mengaktifkan fungsi publik!")
    }
}

const disablePublicFunctions = async (message: Message) => {
    try {
        logger.info("ACTION: Disable Public Functions")

        const currentId = message.author
        const botId = client.info.wid._serialized

        if (currentId == botId) {
            await updatePublicFunctionState(false)
            await message.reply("Fungsi publik dinonaktifkan!")
            logger.info("Success disabling public functions!")
        }
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to disable public functions!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Gagal menonaktifkan fungsi publik!")
    }
}

export {
    enablePublicFunctions,
    disablePublicFunctions
}