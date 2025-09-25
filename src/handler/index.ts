import { Message } from 'whatsapp-web.js';
import { messageCommands, messageCreateCommands } from './registration';
import { responseTakeOver } from './command/takeover';
import State from '../model/state';

const messageHandler = async (message: Message) => {
  const state = await State.findByPk(1);

  if (state?.publicFunction && !state?.takeover) {
    Object.values(messageCommands).forEach((command) => {
      commandExecutor(command.prefix, message, command.callback);
    });
  } else if (state?.takeover) {
    responseTakeOver(message);
  }
};

const messageCreateHandler = async (message: Message) => {
  Object.values(messageCreateCommands).forEach((command) => {
    commandExecutor(command.prefix, message, command.callback);
  });
};

const commandExecutor = (
  command: string,
  message: Message,
  callback: (message: Message) => void
) => {
  const msgx = message.body.trim();
  let callbackCalled = false;

  if (msgx.indexOf(command) == 0) {
    callback(message);
    callbackCalled = true;
  }

  return callbackCalled;
};

export { messageHandler, messageCreateHandler };
