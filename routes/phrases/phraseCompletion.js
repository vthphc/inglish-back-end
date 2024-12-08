const express = require("express");
const router = express.Router();

const Phrase = require("../../models/phrases");
const User = require("../../models/users");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const phraseSchema = new mongoose.Schema(
//     {
//         topic: String,
//         dialogues: [
//             {
//                 speaker: String,
//                 line: String,
//             },
//         ],
//         createdAt: Date,
//     },
//     { versionKey: false }
// );

router.post("/", async (req, res) => {
    const { userId, topic } = req.body;
    const prompt = `Generate a dialogue about the topic "${topic}" between two speakers, labeled as "Person A" and "Person B". Format each response as: 
    Person A: [line]
    Person B: [line]`;

    try {
        const completions = await model.generateContent(prompt);

        // Split the AI response into dialogues and map to the required format
        const dialogues = completions.response
            .text()
            .split("\n")
            .reduce((acc, line) => {
                const match = line.match(/(Person A|Person B):\s*(.*)/);
                if (match) {
                    acc.push({
                        speaker: match[1], // "Person A" or "Person B"
                        line: match[2], // The dialogue line
                    });
                }
                return acc;
            }, []);

        // Create new phrase object to store in the database
        const newPhrase = new Phrase({
            userId,
            topic,
            dialogues, // Array of speaker-line objects
            createdAt: new Date(),
        });

        // Save to the database
        await newPhrase.save();

        //save this newPhrase ID into user.phrases[]
        const user = await User.findById(userId);
        user.learning.phrases.push(newPhrase._id);
        await user.save();

        // Send the saved data back in response
        res.json(newPhrase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
