import { GroupChat, Message } from "whatsapp-web.js";
import client from "../../worker/client";

const kickFromGroup = async (message: Message) => {
    try {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            message.reply("Maaf, command ini hanya bisa digunakan di Group Chat :(");
            return;
        }
        
        const groupChat = chat as GroupChat;
        const botId = client.info.wid._serialized;

        for (const participant of groupChat.participants) {
            if (participant.id._serialized === botId && !participant.isAdmin) {
                message.reply("Maaf, aku bukan Admin di Group ini :(");
                return;
            }
        }

        if (message.mentionedIds.length === 0) {
            message.reply("gunakan *!kick [@tagOrangnya]*");
            return;
        }

        await groupChat.removeParticipants(message.mentionedIds.map(id => id.toString()));
    } catch (error) {
        console.error("[kickFromGroup]", error);
        message.reply("Yah.. sepertinya aku gagal mengeluarkan anggota dari Group :(");
    }
}

export default kickFromGroup;
