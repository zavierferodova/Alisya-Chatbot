import { Message } from "whatsapp-web.js"
import { removeIndentation } from "../../util/string-util"
import commandRegistration from "../registration"
import botConfig from "../../config/bot-config"

const help = async (message: Message) => {
    message.reply(removeIndentation(`
        👋 Halo, kenalin aku ${botConfig.name} 👋
        
        Personal chatbot sahabat kalian semua 🥳

        Berikut adalah daftar perintah yang dapat kalian lakukan :

        ✅ *${commandRegistration.help.prefix}*
        Melihat daftar perintah yang dapat dilakukan.

        ✅ *${commandRegistration.talk.prefix} [pesan]*
        Butuh teman bicara ? Yuk mari bicarakan hal random denganku.
        Contoh: ${commandRegistration.talk.prefix} Halo ${botConfig.name} 👋

        ✅ *${commandRegistration.resetMemory.prefix}*
        Reset memori percakapan untuk membuat topik pembicaraan yang baru.

        ✅ *${commandRegistration.stickerize.prefix}*
        Kirim sebuah gambar lalu beri pesan ${commandRegistration.stickerize.prefix} untuk membuat sticker.

        ✅ *${commandRegistration.forward.prefix} [nomor] [pesan]*
        Kirim pesan atau gambar ke seseorang melalui ${botConfig.name}.
        Contoh: ${commandRegistration.forward.prefix} 628xxx Ada hadiah di tas kamu dari someone

        ✅ *${commandRegistration.add.prefix} [nomor]*
        Menambahkan nomor telepon ke dalam group.
        Contoh: ${commandRegistration.add.prefix} 628xxx 628xxx

        ✅ *${commandRegistration.kick.prefix} [@tagOrangnya]*
        Mengeluarkan seseorang atau beberapa dari group.
        Contoh: ${commandRegistration.kick.prefix} @sopo @jarwo

        ✅ *${commandRegistration.tagAll.prefix}*
        Melakukan tagging ke seluruh anggota group.
    `))
}

export default help
