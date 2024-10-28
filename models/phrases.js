const mongoose = require("mongoose");

const phraseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
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