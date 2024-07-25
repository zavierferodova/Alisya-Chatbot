import { Message } from "whatsapp-web.js"
import { removeIndentation } from "../../util/string-util"

const help = async (message: Message) => {
    message.reply(removeIndentation(`
        👋 Halo, kenalin aku Alisya 👋
        
        Personal chatbot sahabat kalian semua 🥳

        Berikut adalah daftar perintah yang dapat kalian lakukan :

        ✅ *!help*
        Melihat daftar perintah yang dapat dilakukan.

        ✅ *!talk [pesan]*
        Butuh teman bicara ? Yuk mari obrolkan hal random denganku.
        Contoh: !talk Halo Alisya 👋

        ✅ *!resetmemory*
        Reset memori percakapan untuk membuat topik pembicaraan yang baru.

        ✅ *!stickerize*
        Kirim sebuah gambar lalu beri pesan !stickerize untuk membuat sticker.

        ✅ *!forward* [nomor] [pesan]
        Kirim pesan atau gambar ke seseorang melalui Alisya.
        Contoh: !forward 628xxx Ada hadiah di tas kamu dari someone

        ✅ *!add [nomor]*
        Menambahkan nomor telepon ke dalam group.
        Contoh: !add 628xxx 628xxx

        ✅ *!kick [@tagOrangnya]*
        Mengeluarkan seseorang atau beberapa dari group.
        Contoh: !kick @sopo @jarwo

        ✅ *!tagsemua*
        Melakukan tagging ke seluruh anggota group.
    `))
}

export default help
