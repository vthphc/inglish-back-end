const mongoose = require("mongoose");
const Lesson = require("./lessons");

const examSchema = new mongoose.Schema(
	{
		title: String,
		content: [{ type: Lesson.schema, required: true }],
		createdAt: Date,
	},
	{ versionKey: false }
);

module.exports = mongoose.model("Exam", examSchema);
