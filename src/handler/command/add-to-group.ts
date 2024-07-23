import { GroupChat, Message } from "whatsapp-web.js";
import { extractGroupPhones } from "../../util/group-util";
import client from "../../worker/client";

const addToGroup = async (message: Message) => {
    try {
        const chat = await message.getChat();
        const msgx = message.body;

        if (!chat.isGroup) {
            message.reply("Maaf, command ini hanya bisa digunakan di Group Chat :(");
            return;
        }

        const groupChat = chat as GroupChat;
        const existingParticipants = extractGroupPhones(groupChat);
        const botId = client.info.wid._serialized;

        for (const participant of groupChat.participants) {
            if (participant.id._serialized === botId && !participant.isAdmin) {
                message.reply("Maaf, aku bukan Admin di Group ini :(");
                return;
            }
        }

        const phoneToAdd = msgx.split(/\D+/).filter(Boolean);
        let requestToAdd = [];
        let failedToAdd = [];
        let alreadyInGroup = [];

        for (let phone of phoneToAdd) {
            if (existingParticipants.has(phone)) {
                console.log("[!] " + phone + " is already a participant in the group!");
                alreadyInGroup.push(phone);
            } else {
                if (await client.isRegisteredUser(phone + "@c.us")) {
                    const contact = await client.getContactById(phone + "@c.us");
                    const idnmr = contact.id._serialized;
                    requestToAdd.push(idnmr);
                } else {
                    console.log("[!] " + phone + " is not a registered user!");
                    failedToAdd.push(phone);
                }
            }
        }

        if (requestToAdd.length > 0) {
            await groupChat.addParticipants(requestToAdd);
        }
        if (failedToAdd.length > 0) {
            message.reply("Nomor yang tidak terdaftar di Whatsapp: " + failedToAdd.toString());
        }
        if (alreadyInGroup.length > 0) {
            message.reply("Nomor yang sudah ada di Group: " + alreadyInGroup.toString());
        }
    } catch (error) {
        console.error("[addToGroup]", error);
        message.reply("Yah.. sepertinya aku gagal menambahkan anggota ke group :(");
    }
}

export default addToGroup;
