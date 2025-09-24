import { Message } from 'whatsapp-web.js';
import addToGroup from './command/add';
import kickFromGroup from './command/kick';
import stickerize from './command/stickerize';
import tagAll from './command/tagall';
import talk from './command/talk';
import forward from './command/forward';
import resetMemory from './command/reset-memory';
import { disableTakeOver, enableTakeOver } from './command/takeover';
import { disablePublicFunctions, enablePublicFunctions } from './command/public-functions';
import { publicHelp, selfHelp } from './command/help';

type MessageCommand = {
  prefix: string;
  callback: (message: Message) => void;
};

enum MessageCommandKey {
  help = 'help',
  add = 'add',
  kick = 'kick',
  tagAll = 'tagAll',
  forward = 'forward',
  stickerize = 'stickerize',
  talk = 'talk',
  resetMemory = 'resetMemory',
}

enum MessageCreateCommandKey {
  help = 'help',
  takeOver = 'takeOver',
  disTakeOver = 'disTakeOver',
  publicFunctions = 'publicFunctions',
  disPublicFunctions = 'disPublicFunctions',
}

const messageCommands: Record<MessageCommandKey, MessageCommand> = {
  help: {
    prefix: '!help',
    callback: publicHelp,
  },
  add: {
    prefix: '!add',
    callback: addToGroup,
  },
  kick: {
    prefix: '!kick',
    callback: kickFromGroup,
  },
  tagAll: {
    prefix: '!tagsemua',
    callback: tagAll,
  },
  forward: {
    prefix: '!forward',
    callback: forward,
  },
  stickerize: {
    prefix: '!stickerize',
    callback: stickerize,
  },
  talk: {
    prefix: '!talk',
    callback: talk,
  },
  resetMemory: {
    prefix: '!resetmemory',
    callback: resetMemory,
  },
};

const messageCreateCommands: Record<MessageCreateCommandKey, MessageCommand> = {
  help: {
    prefix: '!help',
    callback: selfHelp,
  },
  takeOver: {
    prefix: '!takeover',
    callback: enableTakeOver,
  },
  disTakeOver: {
    prefix: '!distakeover',
    callback: disableTakeOver,
  },
  publicFunctions: {
    prefix: '!public',
    callback: enablePublicFunctions,
  },
  disPublicFunctions: {
    prefix: '!dispublic',
    callback: disablePublicFunctions,
  },
};

export { messageCommands, messageCreateCommands };

export type { MessageCommand, MessageCommandKey, MessageCreateCommandKey };
