import { Message } from "whatsapp-web.js";
import addToGroup from "./command/add-to-group";
import help from "./command/help";
import kickFromGroup from "./command/kick-from-group";
import stickerize from "./command/stickerize";
import tagAll from "./command/tag-all";
import talk from "./command/talk";

type MessageCommand = {
    prefix: string;
    callback: (message: Message) => void;
}

enum CommandKey {
    help = 'help',
    add = 'add',
    kick = 'kick',
    tagAll = 'tagAll',
    stickerize = 'stickerize',
    talk = 'talk'
}

const commandRegistration: Record<CommandKey, MessageCommand> = {
    help: {
        prefix: '!help',
        callback: help
    },
    add: {
        prefix: '!add',
        callback: addToGroup
    },
    kick: {
        prefix: '!kick',
        callback: kickFromGroup
    },
    tagAll: {
        prefix: '!tagsemua',
        callback: tagAll
    },
    stickerize: {
        prefix: '!stickerize',
        callback: stickerize
    },
    talk: {
        prefix: '!talk',
        callback: talk
    }
}

export default commandRegistration;
export type { MessageCommand, CommandKey }
