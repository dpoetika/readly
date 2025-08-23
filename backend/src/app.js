import express from "express"
import bookRouter from "./routes/books.routes.js"
import categoryRouter from "./routes/category.routes.js"


const app = express()
app.use(express.json())

app.use("/books",bookRouter)
app.use("/categories",categoryRouter)

app.get("/", async(req, res) => {
    res.send("server is alive");
});


/*
app.listen(config.PORT, () => {
  console.log("http://localhost:3000/books/top\nhttp://localhost:3000/books/search/?query=sa");
});
*/

export default app;