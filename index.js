import express from "express";
import pg from "pg";

const port = 3000;
const app = express();

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Starting server at port : ${port}`)
});