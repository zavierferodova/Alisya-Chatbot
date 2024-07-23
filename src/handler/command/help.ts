import { Message } from "whatsapp-web.js";
import { removeIndentation } from "../../util/string-util";

const help = async (message: Message) => {
    message.reply(removeIndentation(`
        👋 Halo, kenalin aku Alisya 👋
        
        Personal chatbot sahabat kalian semua 🥳

        Berikut adalah daftar perintah yang dapat kalian lakukan :
        - !help
        - !add [nomor]
        - !kick [@tagOrangnya]
        - !stickerize
        - !tagsemua
        - !talk [pesan]
    `))
}

export default help;
