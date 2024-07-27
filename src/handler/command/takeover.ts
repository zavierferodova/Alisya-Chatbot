import { Message } from "whatsapp-web.js"
import client from "../../worker/client"
import State from "../../model/state"
import logger from "../../logger/pino"
import { parseStackTrace } from "../../util/string-util"
import { sha256KeyedHash } from "../../util/crypto-util"
import { isTakeOverMemoryEmpty, resetAllTakeOverMemory, responseUserMessage } from "../../llm/groq-chat"
import config from "../../config"

const enableTakeOver = async (message: Message) => {
    try {
        logger.info("ACTION: Enable Take Over")

        const currentId = message.author
        const botId = client.info.wid._serialized

        if (currentId == botId) {
            logger.info("Enabling take over ...")

            const state = await State.findByPk(1)
            const result = await state?.update({
                takeover: true
            })
            
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

            const state = await State.findByPk(1)
            const result = await state?.update({
                takeover: false
            })
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

        if (await isTakeOverMemoryEmpty(encryptedId)) {
            await message.reply("Maaf, sepertinya pemilik akun ini sedang sibuk. Berikut kamu dapat berbicara dengan asistennya.")
            const response = await responseUserMessage(encryptedId, "Siapa kamu ?", { takeOver: true, ownerName: client.info.pushname })
            await client.sendMessage(id, response)
        } else {
            const userQuestion = msgx.trim()
            const response = await responseUserMessage(encryptedId, userQuestion, { takeOver: true, ownerName: client.info.pushname })
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