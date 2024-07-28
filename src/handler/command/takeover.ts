import { Message } from "whatsapp-web.js"
import client from "../../worker/client"
import logger from "../../logger/pino"
import { parseStackTrace } from "../../util/string-util"
import { sha256KeyedHash } from "../../util/crypto-util"
import { isTakeOverMemoryEmpty, resetAllTakeOverMemory, responseUserMessage } from "../../llm/groq-chat"
import config from "../../config"
import { changeTakeOverState, getTakeOverConfig, setTakeOverOwner } from "../../util/takeover-util"
import { messageCreateCommands } from "../registration"

const enableTakeOver = async (message: Message) => {
    try {
        logger.info("ACTION: Enable Take Over")

        const currentId = message.author
        const botId = client.info.wid._serialized
        const msgx = message.body.trim()
        const ownerName = msgx.replace(messageCreateCommands.takeOver.prefix, "")

        if (currentId == botId) {
            logger.info("Enabling take over ...")

            await setTakeOverOwner(ownerName)
            const result = await changeTakeOverState(true)
            if (result) {
                await message.reply("Mengambil alih WhatsApp diaktifkan!")
            }

            logger.info("Success enabling take over!")
        }
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to disable take over!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Gagal mengambil alih WhatsApp!")
    }
}

const disableTakeOver = async (message: Message) => {
    try {
        logger.info("ACTION: Disable Take Over")

        const currentId = message.author
        const botId = client.info.wid._serialized

        if (currentId == botId) {
            logger.info("Disabling take over ...")

            const result = await changeTakeOverState(false)
            await setTakeOverOwner(null)
            await resetAllTakeOverMemory()
            
            if (result) {
                await message.reply("Mengambil alih WhatsApp dinonaktifkan!")
            }

            logger.info("Success disabling take over!")
        }
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to disable take over!",
            error: parseStackTrace(err.stack),
        })
        message.reply("Gagal menonaktifkan ambil alih WhatsApp!")
    }
}

const responseTakeOver = async (message: Message) => {
    try {
        logger.info("ACTION: Response Take Over")

        const msgx = message.body.trim()
        const chat = await message.getChat()

        if (chat.isGroup) {
            return
        }
        
        logger.info("Getting llm response ...")
        const id = message.from
        const encryptedId = sha256KeyedHash(config.chiperKey, id)
        const takeOverConfig = await getTakeOverConfig()
        const ownerName: string = (takeOverConfig?.ownerName) ? takeOverConfig?.ownerName : client.info.pushname

        if (await isTakeOverMemoryEmpty(encryptedId)) {
            await message.reply("Maaf, sepertinya pemilik akun ini sedang sibuk. Berikut kamu dapat berbicara dengan asistennya.")
            const response = await responseUserMessage(encryptedId, "Siapa kamu ?", { takeOver: true, ownerName: ownerName })
            await client.sendMessage(id, response)
        } else {
            const userQuestion = msgx.trim()
            const response = await responseUserMessage(encryptedId, userQuestion, { takeOver: true, ownerName: ownerName })
            await message.reply(response)
        }

        logger.info("Success getting llm response!")
    } catch (error) {
        const err = error as Error
        logger.error({
            message: "Failed to get llm response!",
            error: parseStackTrace(err.stack),
        })
    }
}

export {
    enableTakeOver,
    disableTakeOver,
    responseTakeOver
}