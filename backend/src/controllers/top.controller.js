import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function top() {
    const object = [];
    for (let index = 0; index < 4; index++) {
        const uri = config.TOP_URL+String((index*25)+1)
        console.log(uri)
        const { data } = await axios.get(uri);
        const $ = cheerio.load(data);

        $("li.booklink").each((i, el) => {
            const id = $(el).find("a.link").attr("href");
            const img = $(el).find("img").attr("src");
            const title = $(el).find("span.title").text().trim();
            const author = $(el).find("span.subtitle").text().trim();
            if (id.includes("/ebooks/")) {
                object.push({ "id": id.replace("/ebooks/", ""), "title": title, author: author,img:img});
            }
        });
    }
    
    return object;
}
