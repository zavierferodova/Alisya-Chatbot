import { Message } from "whatsapp-web.js";
import commandRegistration from "./command-registration";

const messageHandler = (message: Message) => {
    Object.values(commandRegistration).forEach((command) => {
        registerCommand(command.prefix, message, command.callback);
    });
}

const registerCommand = (
    command: string,
    message: Message,
    callback: (message: Message) => void) => {
    let msgx = message.body.trim();
    if (msgx.indexOf(command) == 0) {
        callback(message);
    }
}

export default messageHandler;
