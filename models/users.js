const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: String,
        username: String,
        password: String,
        learning: {
            listening: [
                {
                    lesson: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Lesson",
                    },
                    score: Number,
                },
            ],
            reading: [
                {
                    lesson: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Lesson",
                    },
                    score: Number,
                },
            ],
            games: [String],
            flashcards: [String],
            phrases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phrase" }],
        },
        examsTaken: [String],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
