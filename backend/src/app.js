import express from "express"
import bookRouter from "./routes/books.routes.js"
import categoryRouter from "./routes/category.routes.js"
import limiter from "./middleware/rate_limiter.js"
import config from "./config/config.js"

const app = express()
app.use(express.json())

app.use(limiter)

app.use("/books",bookRouter)
app.use("/categories",categoryRouter)

app.get("/", (req, res) => {
  res.send({usage:[
    `https://readly-alpha.vercel.app/books → brings top books`,
    `https://readly-alpha.vercel.app/books/search?query={some string} → search`,
    `https://readly-alpha.vercel.app/books/:id → plain txt of book`,
    `https://readly-alpha.vercel.app/categories/ → list categories`,
    `https://readly-alpha.vercel.app/categories/:category_id → books in category`,
  ]});
});
 
/* 
app.listen(config.PORT, () => {
  console.log("http://localhost:3000/books/top\nhttp://localhost:3000/books/search/?query=sa");
});

*/
export default app;