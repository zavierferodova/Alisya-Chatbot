import { GroupChat, Message } from "whatsapp-web.js";
import client from "../../worker/client";

const tagAll = async (message: Message) => {
    try {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            message.reply("Maaf, command ini hanya bisa digunakan di Group Chat :(");
            return;
        }

        const groupChat = chat as GroupChat;
        const participants = groupChat.participants;

        let text = ""
        let mentions = [];

        for (let participant of participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions: mentions.map(contact => contact.id._serialized) });
    } catch (error) {
        console.error("[tagAll]", error);
        message.reply("Yah.. sepertinya aku gagal melakukan tag :(");
    }
}

export default tagAll;
