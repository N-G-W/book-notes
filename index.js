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

async function getAllNotes() {
    let response = await db.query("select * from notes");
    return response ?? "Couldn't get data";
}

async function getParticularNote(id) {
    let response = await db.query("select * from notes where notes.id=($1)", [id]);
    return response ?? "Couldn't get data";
}

async function addNotes(data) {
    let response = await db.query(`insert into notes(title, date_read, review, overview, notes)
    values ('${data.title}', '${data.date_read}', '${data.review}',
    '${data.notes}', '${data.notes}') returning *`);
    return response ?? "Couldn't get data";
}

async function updateNotes() {
    let response = await db.query(`insert into notes(title, date_read, review, overview, notes)
    values ('${req.body.title}', '${req.body.date_read}', '${req.body.review}',
    '${req.body.notes}', '${req.body.notes}') returning *`);
    return response ?? "Couldn't get data";
}

async function deleteNotes() {
    let response = await db.query(`insert into notes(title, date_read, review, overview, notes)
    values ('${req.body.title}', '${req.body.date_read}', '${req.body.review}',
    '${req.body.notes}', '${req.body.notes}') returning *`);
    return response ?? "Couldn't get data";
}

app.get("/", async (req, res) => {
    // 1. get all the post after connecting to the database
    let response = await getAllNotes();
    // console.log(response.rows);
    res.render("index.ejs",{
        notes: response.rows ?? [],
    });
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    // 2. create a post by connecting to the database
    let response = await addNotes(req.body);
    res.redirect("/", {
        notes: response.rows ?? [],
    });
});

app.get("/read/:id", async (req, res) => {
    let paramID = req.params.id;
    console.log(paramID);
    let note = await getParticularNote(paramID);
    console.log(note.rows[0])
    res.render("read.ejs", {
        note: note.rows[0] ?? [],
    });
})

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Starting server at port : ${port}`)
});