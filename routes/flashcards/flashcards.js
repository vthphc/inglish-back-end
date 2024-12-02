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

router.delete("/:id", async (req, res) => {
	try {
		const removedFlashcard = await Flashcard.remove({
			_id: req.params.id,
		});
		res.json(removedFlashcard);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
