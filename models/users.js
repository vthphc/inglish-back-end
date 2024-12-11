const mongoose = require("mongoose");
const Flashcard = require("./flashcards");
const Phrase = require("./phrases");
const Exam = require("./exams");
const Lesson = require("./lessons");

const userSchema = new mongoose.Schema(
	{
		email: String,
		username: String,
		password: String,
		learning: {
			// listening: [
			//     {
			//         type: mongoose.Schema.Types.ObjectId,
			//         ref: "Lesson",
			//     },
			// ],
			// reading: [
			//     {
			//         type: mongoose.Schema.Types.ObjectId,
			//         ref: "Lesson",
			//     },
			// ],
			games: [String],
			flashcards: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Flashcard",
				},
			],
			phrases: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Phrase",
				},
			],
		},
		examsTaken: [
			{
				examId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Exam",
				},
				selectedAnswers: [
					{
						questionId: {
							type: mongoose.Schema.Types.ObjectId,
							ref: "Exam.questions",
						},
						selectedAnswer: String,
						isCorrect: Boolean,
					},
				],
				score: String,
			},
		],
		createdAt: Date,
	},
	{ versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
