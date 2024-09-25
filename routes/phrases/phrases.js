const express = require("express");
const router = express.Router();

const Phrase = require("../../models/phrases");

router.get("/", async (req, res) => {
    try {
        const phrases = await Phrase.find();
        res.json(phrases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const phrase = await Phrase.findById(req.params.id);
        res.json(phrase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const phrase = await Phrase.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted phrase" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
