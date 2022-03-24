const express = require('express');
let notes = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

function validateNote(note) {
    if (!note.title !== 'string'){
        return false;
    }

    if (!note.text !== 'string'){
        return false;
    }
    return true;
}

app.use(express.static('public'));

app.get('/api/notes', async (req, res) => {
    notes = await readFileAsync (
       path.join(__dirname, './db/db.json'), "utf8" 
    );
    notes = JSON.parse(notes);
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    notes = await readFileAsync (
        path.join(__dirname, './db/db.json'), "utf8" 
    )
    notes = JSON.parse(notes);
    req.body.id = uuidv4();
    if (!req.body) {
        res.status(400).send('The title and text fields are required, please complete!');
    } else {
        notes.push(req.body);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify( notes, null, 2)
    );
        res.json(req.body);
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    notes = await readFileAsync (
        path.join(__dirname, './db/db.json'), "utf8" 
    )
    notes = JSON.parse(notes);
    var newNotesArr = [];
    for(i=0; i<notes.length; i++) {
        if (req.params.id !== notes[i].id) {
            newNotesArr.push(notes[i]);
        }
    }
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify( newNotesArr , null, 2)
    );
    res.json({ok: true})
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});