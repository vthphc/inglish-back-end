const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        email: String,
        learning: {
            listening: [String],
            reading: [String],
            games: [String],
            flashcards: [String],
            phrases: [String],
        },
        examsTaken: [String],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
