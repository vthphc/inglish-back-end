const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        title: String,
        type: String,
        contentURL: String,
        question_questionName: String,
        question_questionOptions: [String],
        question_correctAnswer: String,
        AIExplaination: String,
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Lesson", lessonSchema);
