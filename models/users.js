const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        profile_firstName: String,
        profile_lastName: String,
        learningProgress_listening: [String],
        learningProgress_reading: [String],
        learningProgress_games: [String],
        learningProgress_flashcards: [String],
        learningProgress_phrases: [String],
        examsTaken: [String],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
