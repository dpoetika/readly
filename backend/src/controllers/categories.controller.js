import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function get_categories() {
    console.log(config.GET_CATEGORIES_URI)
    const { data } = await axios.get(config.GET_CATEGORIES_URI);      
    const $ = cheerio.load(data);              

    const results = {};

    $(".bookshelves .book-list ul li a").each((i, el) => {
        const href = $(el).attr("href");       
        const text = $(el).text().trim();  
        results[i]={ id:href.replace("/ebooks/bookshelf/",""),title:text };
    });

    return {message:"succes","data":results};
}


export async function get_category_books(category_id) {
    const objects = {}; 
    for (let index = 0; index < 4; index++) {
        
        const { data } = await axios.get(`${config.GET_CATEGORY_BOOKS}/${category_id}/?start_index=${index*25}`);      
        const $ = cheerio.load(data);              

        $("li.booklink").each((i, el) => {
            const aTag = $(el).find("a.link");
            const id = aTag.attr("href").replace("/ebooks/","");  // /ebooks/27107
            const thumbnail = aTag.find("img.cover-thumb").attr("src"); // kapak resmi
            const title = aTag.find("span.title").text().trim();
            const author = aTag.find("span.subtitle").text().trim();
            const extra = aTag.find("span.extra").text().trim();
            objects[i+String(index)] = { id, thumbnail, title, author, extra }
        });
    }
    return {message:"succes","data":objects};
}
