const mongoose = require("mongoose");

const phoneticSchema = new mongoose.Schema(
    {
        type: String,
        symbol: String,
        sound: String,
        example: String,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Phonetic", phoneticSchema);
