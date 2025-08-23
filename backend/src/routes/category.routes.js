import express from "express"
import { get_book } from "../controllers/get_book.controller.js"

import { get_categories } from "../controllers/categories.controller.js"
import { get_category_books } from "../controllers/categories.controller.js"
const categoryRouter = express.Router()



categoryRouter.get("/",async(req,res)=>{
    res.send(await get_categories());
})

categoryRouter.get("/:id",async(req,res)=>{
    const id = req.params.id
    res.send(await get_category_books(id));
})



export default categoryRouter