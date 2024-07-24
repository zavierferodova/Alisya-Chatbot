import { Chat, GroupChat, Message } from "whatsapp-web.js";
import client from "../worker/client";

interface CheckGroupInvocationOptions {
    autoReply?: boolean;
}

const filterGroupInvoked = (
    chat: Chat, 
    message: Message,
    options: CheckGroupInvocationOptions = {
        autoReply: true
    }) => {
    if (!chat.isGroup && options.autoReply) {
        message.reply("Maaf, command ini hanya bisa digunakan di group chat 😢");
    }

    return !chat.isGroup;
}

const filterAdminInvoked = (
    chat: Chat, 
    message: Message,
    options: CheckGroupInvocationOptions = {
        autoReply: true
    }) => {
    const groupNotInvoked = filterGroupInvoked(chat, message)

    if (!groupNotInvoked) {
        const groupChat = chat as GroupChat;
        const botId = client.info.wid._serialized;

        for (const participant of groupChat.participants) {
            if (participant.id._serialized === botId && !participant.isAdmin) {
                if (options.autoReply) {
                    message.reply("Maaf, aku bukan Admin di group ini 😢");
                }
                return true;
            }
        }

        return false;
    }

    return true;
}

export {
    filterGroupInvoked,
    filterAdminInvoked
}