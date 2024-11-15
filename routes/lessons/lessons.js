const express = require("express");
const router = express.Router();

const Lesson = require("../../models/lessons");

router.get("/", async (req, res) => {
	try {
		const lessons = await Lesson.find();
		res.json(lessons);
	} catch (err) {
		res.json({ message: err });
	}
});

router.get("/:lessonId", async (req, res) => {
	try {
		const lesson = await Lesson.findById(req.params.lessonId);
		res.json(lesson);
	} catch (err) {
		res.json({ message: err });
	}
});

router.post("/", async (req, res) => {
	const lesson = new Lesson({
		title: req.body.title,
		type: req.body.type,
		contentURL: req.body.contentURL,
		questions: req.body.questions,
		AIExplaination: "",
		createdAt: new Date(),
	});

	try {
		const savedLesson = await lesson.save();
		res.json(savedLesson);
	} catch (err) {
		res.json({ message: err });
	}
});

router.patch("/:lessonId", async (req, res) => {
	try {
		const updatedLesson = await Lesson.updateOne(
			{ _id: req.params.lessonId },
			{
				$set: {
					title: req.body.title,
					type: req.body.type,
					contentURL: req.body.contentURL,
					questions: req.body.question,
					AIExplaination: req.body.AIExplaination,
				},
			}
		);
		res.json(updatedLesson);
	} catch (err) {
		res.json({ message: err });
	}
});

router.delete("/:lessonId", async (req, res) => {
	try {
		const removedLesson = await Lesson.remove({
			_id: req.params.lessonId,
		});
		res.json(removedLesson);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
