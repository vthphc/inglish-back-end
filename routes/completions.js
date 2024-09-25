const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get("/", async (req, res) => {
    const prompt = "give me 10 phrases for a new product launch";
    try {
        const completions = await model.generateContent(prompt);
        res.json({ completions: completions.response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
