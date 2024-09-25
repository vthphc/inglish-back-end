const mongoose = require("mongoose");

const phraseSchema = new mongoose.Schema(
    {
        topic: String,
        dialogues: [
            {
                speaker: String,
                line: String,
                _id: false,
            },
        ],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Phrase", phraseSchema);