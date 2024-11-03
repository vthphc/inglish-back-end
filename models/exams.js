const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
	{
		title: String,
		content: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
		],
		createdAt: Date,
	},
	{ versionKey: false }
);

module.exports = mongoose.model("Exam", examSchema);
