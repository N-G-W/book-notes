import express from "express";
import pg from "pg";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // 1. get all the post after connecting to the database
    res.render("index.ejs");
})

app.get("/add", (req, res) => {
    res.render("add.ejs");
})

app.post("/add", (req, res) => {
    // 2. create a post by connecting to the database
    res.redirect("/");
})

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Starting server at port : ${port}`)
});