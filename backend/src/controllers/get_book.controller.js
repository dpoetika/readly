import axios from "axios";
import config from "../config/config.js";

export async function get_book(id) {
    try {
        const { data } = await axios.get(`${config.GET_BOOK_URI}/${id}/pg${id}.txt`);

        const startTag = "*** START OF THE PROJECT GUTENBERG EBOOK";
        const endTag = "*** END OF THE PROJECT GUTENBERG EBOOK";

        const startIndex = data.indexOf(startTag);
        const endIndex = data.indexOf(endTag);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Kitap başlangıç veya bitiş etiketi bulunamadı.");
        }

        let content = data.slice(startIndex + data.substring(startIndex).indexOf("\n") + 1, endIndex);

        return { message: "succes", "data": content.trim() };

    } catch (error) {
        return { message: "failed", error: error.message || error };
    }
}