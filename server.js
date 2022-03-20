const express = require('express');
const { notes } = require('./db/notes.json');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/notes.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return animal;
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

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    if (!validateNote(req.body)) {
        res.status(400).send('The title and text field are required, please complete!');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});