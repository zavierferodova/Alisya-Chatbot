import { Chat, GroupChat } from "whatsapp-web.js";

const extractGroupPhones = (chat: GroupChat) => {
    const existingParticipants = new Set(chat.participants.map(participant => participant.id.user));
    return existingParticipants;
}

export {
    extractGroupPhones
}