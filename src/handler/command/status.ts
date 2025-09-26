import State from '../../model/state';
import { Message } from 'whatsapp-web.js';
import { removeIndentation } from '../../util/string-util';

export const botStatus = async (message: Message) => {
  const state = await State.findByPk(1);
  message.reply(
    removeIndentation(`
    *BOT STATUS*

    - Takeover : ${state?.takeover}
    - Public : ${state?.publicFunction}
`)
  );
};
