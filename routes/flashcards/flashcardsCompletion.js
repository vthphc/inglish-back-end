const express = require("express");
const router = express.Router();
const Flashcard = require("../../models/flashcards");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Flashcard Schema Example (Comment for reference)
// const flashcardSchema = new mongoose.Schema(
//     {
//         topic: String,
//         word: String,
//         definition: String,
//         example: String,
//         category: String,
//         pronunciation: [String], // Array of phonetics
//         createdAt: Date,
//     },
//     { versionKey: false }
// );

router.post("/", async (req, res) => {
    const { userId, topic } = req.body;

    const prompt = `
    Generate a flashcard about the topic "${topic}" with the following details:
    - A single word related to the topic.
    - The word's definition.
    - An example sentence using the word in context.
    - The category of the word (e.g., noun, verb, adjective).
    - The createdBy field set to "Google Gemini".

    Format your response exactly like this example:
    {
      "topic": "Fishing",
      "word": "Angling",
      "definition": "the sport of trying to catch fish with a rod, line (= string), and hook",
      "example": "A game fish may be defined as one that will make a good fight for its life and that is caught by scientific methods of angling.",
      "category": "noun",
      "createdBy": "Google Gemini"
    }
    `;

    try {
        // Step 1: Generate flashcard content from Google Generative AI
        const completions = await model.generateContent(prompt);

        // Clean and parse the AI response
        let rawResponse = completions.response.text().trim();
        rawResponse = rawResponse.replace(/```(?:json)?/g, "");

        let flashcardData;
        try {
            flashcardData = JSON.parse(rawResponse);
        } catch (jsonErr) {
            console.error("Invalid JSON response from AI:", rawResponse);
            return res
                .status(500)
                .json({
                    message: "AI response is not valid JSON",
                    error: jsonErr.message,
                });
        }

        // Step 2: Fetch pronunciation data for the word from dictionaryapi.dev
        const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${flashcardData.word}`;
        console.log("Fetching pronunciation data from:", dictionaryApiUrl);
        let phonetics = [];

        try {
            const dictionaryResponse = await axios.get(dictionaryApiUrl);
            const dictionaryData = dictionaryResponse.data;

            // Extract phonetics (text and audio)
            phonetics =
                dictionaryData[0]?.phonetics?.map((phonetic) => ({
                    text: phonetic.text || null,
                    audio: phonetic.audio || null,
                })) || [];
        } catch (dictionaryErr) {
            console.warn(
                `Failed to fetch pronunciation for word "${flashcardData.word}":`,
                dictionaryErr.message
            );
        }

        // Step 3: Add additional fields to the flashcard data
        flashcardData.userId = userId;
        flashcardData.createdAt = new Date();
        flashcardData.phonetics = phonetics;

        // Step 4: Create and save the flashcard in the database
        const newFlashcard = new Flashcard(flashcardData);
        await newFlashcard.save();

        // Step 5: Respond with the saved flashcard data
        res.status(201).json(newFlashcard);
    } catch (err) {
        console.error("Error creating flashcard:", err.message);
        res.status(500).json({
            message: "Failed to create flashcard",
            error: err.message,
        });
    }
});

module.exports = router;
