const express = require("express");
const router = express.Router();

const Flashcard = require("../../models/flashcards");

router.get("/", async (req, res) => {
    try {
        const flashcards = await Flashcard.find();
        res.json(flashcards);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const flashcard = await Flashcard.findById(req.params.id);
        res.json(flashcard);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const flashcards = await Flashcard.find({ userId });
        res.json(flashcards);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get("/user/:userId/this-month", async (req, res) => {
    const userId = req.params.userId;

    const currentDate = new Date();
    const startOfThisMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const endOfThisMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );

    try {
        const flashcards = await Flashcard.find({
            userId,
            createdAt: {
                $gte: startOfThisMonth,
                $lte: endOfThisMonth,
            },
        });

        res.json(flashcards);
    } catch (err) {
        console.error("Error fetching flashcards:", err.message);
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const removedFlashcard = await Flashcard.findByIdAndDelete(
            req.params.id
        );
        res.json(removedFlashcard);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/getDataFromDictionaryAPI", async (req, res) => {
    const { word, userId } = req.body;

    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        const data = await response.json();

        const newFlashcard = new Flashcard({
            topic: "Vocabulary",
            word: data[0].word,
            definition: data[0].meanings[0].definitions[0].definition,
            example: "",
            category: data[0].meanings[0].partOfSpeech,
            phonetics: [],
            createdAt: new Date(),
            userId,
        });

        newFlashcard.save();

        res.json(newFlashcard);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
