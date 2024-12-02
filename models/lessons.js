const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        title: String,
        type: String,
        contentURL: String,
        questions: [
            {
                questionName: String,
                questionOptions: [String],
                correctAnswer: String,
                AIExplaination: String,
            },
        ],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Lesson", lessonSchema);
