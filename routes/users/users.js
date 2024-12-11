const express = require("express");
const router = express.Router();
const User = require("../../models/users");

router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id/exams-taken", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user.examsTaken);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/:id/exams-taken", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { examId, score, selectedAnswers } = req.body;
		const doesExamExist = user.examsTaken.some(
			(exam) => exam.examId === examId
		);
		if (doesExamExist) {
			currentExam = user.examsTaken.find(
				(exam) => exam.examId === examId
			);
			currentExam.selectedAnswers = selectedAnswers;
			currentExam.score = score;
			user.save();
		}
		user.examsTaken.push({ examId, selectedAnswers, score });
		await user.save();
		res.json(user.examsTaken);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
