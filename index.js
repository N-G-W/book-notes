import express from "express";
import pg from "pg";
import {writeFileSync,readFileSync} from "node:fs";
import axios from "axios";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const databaseCredentials = JSON.parse(readFileSync(".env", {encoding: "utf8"}));

const db = new pg.Client(databaseCredentials);

db.connect();

async function getAllNotes(sort = "") {
    let query;
    switch (sort) {
        case "review":
            query = "select * from notes order by notes.review desc"
            break;
        case "date":
            query = "select * from notes order by notes.date_read desc"
            break;
        default:
            query = "select * from notes";
    }
    let response = await db.query(query);
    return response ?? "Couldn't get data";
}

async function getParticularNote(id) {
    let response = await db.query("select * from notes where notes.id=($1)", [id]);
    return response ?? "Couldn't get data";
}

async function addNotes(data) {
    let response = await db.query(`insert into notes(title, date_read, review, overview, notes, image_url)
    values ('${data.title}', '${data.date_read}', '${data.review}',
    '${data.notes}', '${data.notes}', '${data.image_url}') returning *`);
    return response ?? "Couldn't get data";
}

async function updateNotes(data,id) {
    let response = await db.query(`update notes set title='${data.title}', date_read='${data.date_read}',
    review='${data.review}', overview='${data.notes}', notes='${data.notes}' where notes.id =${id} returning *`);
    return response ?? "Couldn't get data";
}

async function deleteNotes(id) {
    let response = await db.query("delete from notes * where notes.id= ($1)",[id]);
    return response ?? "Couldn't get data";
}

app.get("/", async (req, res) => {
    // 1. get all the post after connecting to the database
    let sortOrder = req.query.sortby;
    let response = await getAllNotes(sortOrder);
    console.log(response.rows);
    
    res.render("index.ejs",{
        notes: response.rows ?? []
    });
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    // 2. create a post by connecting to the database
    let title = req.body.title;
    let array = title.split(" ");
    let url = array.reduce(
        (acc, cur, currentIndex) => { return (currentIndex===0)?acc+cur:acc +"+"+ cur },
        "https://openlibrary.org/search.json?q="
    );
    let document = await axios.get(url);
    try {
        console.log(document.data.docs[0].cover_i ?? "not found");
        req.body.image_url= `https://covers.openlibrary.org/b/id/${document.data.docs[0].cover_i}-M.jpg`;
        console.log(req.body.image_url);
    }
    catch (err) { console.log(err) };
    let response = await addNotes(req.body);
    res.redirect("/");
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

app.get("/edit/:id", async (req, res) => {
    let paramID = req.params.id;
    let note = await getParticularNote(paramID);
    res.render("edit.ejs", {
        note: note.rows[0] ?? [],
    });
})

app.post("/update/:id", async (req, res) => {
    let paramID = req.params.id;
    let note = await updateNotes(req.body, paramID);
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    let paramID = req.params.id;
    let note = await deleteNotes(paramID);
    res.redirect("/");
})

app.listen(port, (e) => {
    if (e) throw e;
    console.log(`Starting server at port : ${port}`)
});