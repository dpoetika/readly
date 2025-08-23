import axios from "axios";
import * as cheerio from "cheerio";
import config from "../config/config.js";

export async function top() {
    const { data } = await axios.get(config.TOP_URL);  
    const $ = cheerio.load(data); 
    
    const object = {};  
    $("li a").each((i, el) => {
        const text = $(el).text().trim();    
        const id = $(el).attr("href"); 
        if (id.includes("/ebooks/")){
            object[i]={"id":id.replace("/ebooks/",""), "title":text.split(" by ")[0],author:text.split(" by ")[1]};
        }
    });
    return object;
}
