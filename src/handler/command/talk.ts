import { GroupChat, Message } from "whatsapp-web.js";
import { responseUserMessage } from "../../llm/groq-chat";
import commandRegistration from "../command-registration";
import { sha256KeyedHash } from "../../util/crypto-util";
import config from "../../config";

const talk = async (message: Message) => {
    try {
        const msgx = message.body.trim();
        const chat = await message.getChat();
        let id = ""

        if (chat.isGroup) {
            const groupChat = chat as GroupChat;
            id = groupChat.id._serialized + message.author;
        } else {
            id = message.from;
        }

        const encryptedId = sha256KeyedHash(config.chiperKey, id);
        const userQuestion = msgx.replace(commandRegistration.talk.prefix, '').trim()
        const response = await responseUserMessage(encryptedId, userQuestion);
        message.reply(response);
    } catch (error) {
        console.error("[talk]", error);
        message.reply("Maaf ya sepertinya sistemku sedang mengalami gangguan :(");
    }
}

export default talk;
