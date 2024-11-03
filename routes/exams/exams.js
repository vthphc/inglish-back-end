const express = require("express");
const router = express.Router();

const Exam = require("../../models/exams");

router.get("/", async (req, res) => {
	try {
		const exams = await Exam.find();
		res.json(exams);
	} catch (err) {
		res.json({ message: err });
	}
});

router.get("/:examId", async (req, res) => {
	try {
		const exam = await Exam.findById(req.params.examId);
		res.json(exam);
	} catch (err) {
		res.json({ message: err });
	}
});

router.post("/", async (req, res) => {
	const exam = new Exam({
		title: req.body.title,
		content: req.body.content,
		createdAt: new Date(),
	});

	try {
		const savedExam = await exam.save();
		res.json(savedExam);
	} catch (err) {
		res.json({ message: err });
	}
});

router.patch("/:examId", async (req, res) => {
	const { examId } = req.params;
	const { title, content } = req.body;
	// if (title) {
	// 	update.title = title;
	// }

	// if (content) {
	// 	update.$addToSet = { content: content };
	// }

	try {
		const existingExam = await Exam.findById(examId);

		if (!existingExam) {
			return res
				.status(404)
				.json({ message: "Exam not found" });
		}

		const update = {};

		update.title = title || existingExam.title;

		if (content) {
			update.$addToSet = { content: content };
		}
		await Exam.updateOne({ _id: examId }, update);
		const updatedExam = await Exam.findById(examId);
		res.json(updatedExam);
	} catch (err) {
		res.json({ message: err });
	}
});

router.delete("/:examId", async (req, res) => {
	try {
		const removedExam = await Exam.remove({
			_id: req.params.examId,
		});
		res.json(removedExam);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
