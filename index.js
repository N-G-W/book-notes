import express from "express";
import pg from "pg";
import {readFileSync} from "node:fs";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const databaseCredentials = JSON.parse(readFileSync(".env", {encoding: "utf8"}));

const db = new pg.Client(databaseCredentials);

db.connect();

app.get("/", (req, res) => {
    // 1. get all the post after connecting to the database
    res.render("index.ejs");
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    // 2. create a post by connecting to the database
    console.log(req.body);
    console.log(req.body.title);
    await db.query(`insert into notes(title, date_read, review, overview, notes)
    values ('${req.body.title}', '${req.body.date_read}', '${req.body.review}',
    '${req.body.notes}', '${req.body.notes}') returning *`)
    res.redirect("/");
});

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Starting server at port : ${port}`)
});