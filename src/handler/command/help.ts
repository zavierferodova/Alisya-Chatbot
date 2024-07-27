import { Message } from "whatsapp-web.js"
import { removeIndentation } from "../../util/string-util"
import { messageCommands } from "../registration"
import botConfig from "../../config/bot-config"

const help = async (message: Message) => {
    message.reply(removeIndentation(`
        👋 Halo, kenalin aku ${botConfig.name} 👋
        
        Personal chatbot sahabat kalian semua 🥳

        Berikut adalah daftar perintah yang dapat kalian lakukan :

        ✅ *${messageCommands.help.prefix}*
        Melihat daftar perintah yang dapat dilakukan.

        ✅ *${messageCommands.talk.prefix} [pesan]*
        Butuh teman bicara ? Yuk mari bicarakan hal random denganku.
        Contoh: ${messageCommands.talk.prefix} Halo ${botConfig.name} 👋

        ✅ *${messageCommands.resetMemory.prefix}*
        Reset memori percakapan untuk membuat topik pembicaraan yang baru.

        ✅ *${messageCommands.stickerize.prefix}*
        Kirim sebuah gambar lalu beri pesan ${messageCommands.stickerize.prefix} untuk membuat sticker.

        ✅ *${messageCommands.forward.prefix} [nomor] [pesan]*
        Kirim pesan atau gambar ke seseorang melalui ${botConfig.name}.
        Contoh: ${messageCommands.forward.prefix} 628xxx Ada hadiah di tas kamu dari someone

        ✅ *${messageCommands.add.prefix} [nomor]*
        Menambahkan nomor telepon ke dalam group.
        Contoh: ${messageCommands.add.prefix} 628xxx 628xxx

        ✅ *${messageCommands.kick.prefix} [@tagOrangnya]*
        Mengeluarkan seseorang atau beberapa dari group.
        Contoh: ${messageCommands.kick.prefix} @sopo @jarwo

        ✅ *${messageCommands.tagAll.prefix}*
        Melakukan tagging ke seluruh anggota group.
    `))
}

export default help
