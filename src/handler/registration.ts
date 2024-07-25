import { Message } from "whatsapp-web.js"
import addToGroup from "./command/add"
import help from "./command/help"
import kickFromGroup from "./command/kick"
import stickerize from "./command/stickerize"
import tagAll from "./command/tagall"
import talk from "./command/talk"
import forward from "./command/forward"
import resetMemory from "./command/reset-memory"

type MessageCommand = {
    prefix: string;
    callback: (message: Message) => void;
}

enum CommandKey {
    help = 'help',
    add = 'add',
    kick = 'kick',
    tagAll = 'tagAll',
    forward = 'forward',
    stickerize = 'stickerize',
    talk = 'talk',
    resetMemory = 'resetMemory'
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
    forward: {
        prefix: '!forward',
        callback: forward,
    },
    stickerize: {
        prefix: '!stickerize',
        callback: stickerize
    },
    talk: {
        prefix: '!talk',
        callback: talk
    },
    resetMemory: {
        prefix: '!resetmemory',
        callback: resetMemory
    }
}

export default commandRegistration
export type { MessageCommand, CommandKey }
