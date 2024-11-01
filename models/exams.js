const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        title: String,
        content: [String],
        createdAt: Date,
    },
    { versionKey: false }
);

module.exports = mongoose.model("Exam", examSchema);
