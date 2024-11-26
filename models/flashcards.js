const mongoose = require("mongoose");
//const phonetics = require("./phonetics");

const flashcardSchema = new mongoose.Schema(
    {
        topic: String,
        word: String,
        definition: String,
        example: String,
        category: String,
        phonetics: [
            {
                text: String,
                audio: String,
            },
        ],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
