const mongoose = require("mongoose");

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
            flashcards: [String],
            phrases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phrase" }],
        },
        examsTaken: [
            {
                exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
                score: Number,
            },
        ],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
