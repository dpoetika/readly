import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function search(query) {
    const { data } = await axios.get(`${config.QUERY_URL}/${query}`);
    const $ = cheerio.load(data); 
    
    const objects = [];  
    $("li.booklink").each((i, el) => {
        const aTag = $(el).find("a.link");
        const id = aTag.attr("href").replace("/ebooks/","");  // /ebooks/27107
        const img = aTag.find("img.cover-thumb").attr("src"); // kapak resmi
        const title = aTag.find("span.title").text().trim();
        const author = aTag.find("span.subtitle").text().trim();
        objects.push({ id, img:"https://www.gutenberg.org" + img.replace("small","medium"), title, author })
  });
    return {message:"succes","data":objects};
}
