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

router.get("/:id/exams-taken/:examId", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		try {
			const exam = user.examsTaken.find(
				(exam) =>
					exam._id.toString() ===
					req.params.examId
			);
			console.log(exam);
			res.json(exam);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/:id/exams-taken", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { examId, title, score, selectedAnswers } = req.body;
		const doesExamExist = user.examsTaken.some(
			(exam) => exam.examId.toString() === examId
		);

		if (doesExamExist) {
			currentExam = user.examsTaken.find(
				(exam) => exam.examId.toString() === examId
			);
			currentExam.selectedAnswers = selectedAnswers;
			currentExam.score = score;
			await user.save();
			return res.json(user.examsTaken);
		}

		user.examsTaken.push({ examId, title, selectedAnswers, score });
		await user.save();

		return res.json(user.examsTaken);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
