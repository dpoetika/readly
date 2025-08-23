import express from "express"
import {top} from "../controllers/top.controller.js"
import { get_book } from "../controllers/get_book.controller.js"
import { search } from "../controllers/search.controller.js"
import { get_categories } from "../controllers/categories.controller.js"

const bookRouter = express.Router()

bookRouter.get("/top",async(req,res)=>{res.send(await top());})

bookRouter.get("/search",async(req,res)=>{
    const name = req.query.query
    res.send(await search(name));
})


bookRouter.get("/categories",async(req,res)=>{
    res.send(await get_categories());
})

bookRouter.get("/:id",async(req,res)=>{
    const id = req.params.id
    res.send(await get_book(id));
})


export default bookRouter