import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function search(query) {
    const { data } = await axios.get(`${config.QUERY_URL}/${query}`);
    const $ = cheerio.load(data); 
    
    const objects = {};  
    $("li.booklink").each((i, el) => {
        const aTag = $(el).find("a.link");
        const id = aTag.attr("href").replace("/ebooks/","");  // /ebooks/27107
        const thumbnail = aTag.find("img.cover-thumb").attr("src"); // kapak resmi
        const title = aTag.find("span.title").text().trim();
        const subtitle = aTag.find("span.subtitle").text().trim();
        const extra = aTag.find("span.extra").text().trim();
        objects[i] = { id, thumbnail, title, subtitle, extra }
  });
    return {message:"succes","data":objects};
}
