import { Message } from "whatsapp-web.js";
import { removeIndentation } from "../../util/string-util";

const help = async (message: Message) => {
    message.reply(removeIndentation(`
        👋 Halo, kenalin aku Alisya 👋
        
        Personal chatbot sahabat kalian semua 🥳

        Berikut adalah daftar perintah yang dapat kalian lakukan :

        ✅ *!help*
        Melihat daftar perintah yang dapat dilakukan.

        ✅ *!add [nomor]*
        Menambahkan nomor telepon ke dalam group.
        Contoh: !add 628xxx 628xxx

        ✅ *!kick [@tagOrangnya]*
        Mengeluarkan seseorang atau beberapa dari group.
        Contoh: !kick @sopo @jarwo

        ✅ *!stickerize*
        Kirim sebuah gambar dan beri pesan !stickerize untuk membuat sticker.

        ✅ *!tagsemua*
        Melakukan tagging ke seluruh anggota group.

        ✅ *!talk [pesan]*
        Butuh teman bicara ? Yuk mari obrolkan hal random denganku.
        Contoh: !talk Halo Alisya 👋
    `))
}

export default help;
