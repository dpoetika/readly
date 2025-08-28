import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function get_categories() {
    console.log(config.GET_CATEGORIES_URI)
    const { data } = await axios.get(config.GET_CATEGORIES_URI);
    const $ = cheerio.load(data);

    const results = [];

    $(".bookshelves .book-list ul li a").each((i, el) => {
        const href = $(el).attr("href");
        const text = $(el).text().trim();
        results.push({ id: href.replace("/ebooks/bookshelf/", ""), title: text });
    });

    return { message: "succes", "data": results };
}


export async function get_category_books(category_id) {
    try {
        const objects = [];
        for (let index = 0; index < 4; index++) {

            const { data } = await axios.get(`${config.GET_CATEGORY_BOOKS}/${category_id}/?start_index=${String((index * 25) + 1)}`);
            const $ = cheerio.load(data);

            $("li.booklink").each((i, el) => {
                const aTag = $(el).find("a.link");
                const id = aTag.attr("href").replace("/ebooks/", "");
                const img = aTag.find("img.cover-thumb").attr("src");
                const title = aTag.find("span.title").text().trim();
                const author = aTag.find("span.subtitle").text().trim();
                objects.push({ id, img: "https://www.gutenberg.org" + img.replace("small", "medium"), title, author })
            });
        }
        return { message: "succes", "data": objects };
    } catch (error) {
        return { message: "failed", error: error.message || error };
    }
}
