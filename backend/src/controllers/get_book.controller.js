import axios from "axios";
import config from "../config/config.js";

export async function get_book(id) {
    const { data } = await axios.get(`${config.GET_BOOK_URI}/${id}/pg${id}.txt`);

    const startTag = "*** START OF THE PROJECT GUTENBERG EBOOK";
    const endTag = "*** END OF THE PROJECT GUTENBERG EBOOK";

    // Başlangıç indexi
    const startIndex = data.indexOf(startTag);
    const endIndex = data.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) {
        throw new Error("Kitap başlangıç veya bitiş etiketi bulunamadı.");
    }

    // İçeriği kes
    let content = data.slice(startIndex + data.substring(startIndex).indexOf("\n") + 1, endIndex);

    // Satır sonlarını normalize et
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Gereksiz boş satırları temizle
    content = content.replace(/\n\s*\n/g, "\n\n");

    return {message:"succes","data":content.trim()};
}