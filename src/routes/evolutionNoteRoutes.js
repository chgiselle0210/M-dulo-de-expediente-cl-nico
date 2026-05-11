const express = require("express");
const router = express.Router();

const {
    createEvolutionNote,
    getEvolutionNotes,
    createClarificationNote
} = require("../controllers/evolutionNoteController");

router.post("/", createEvolutionNote);

router.get("/", getEvolutionNotes);

router.post("/clarifications", createClarificationNote);

module.exports = router;