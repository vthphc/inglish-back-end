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

router.post("/generateContext", async (req, res) => {
    //take the topic, give 5 contexts that could be used for the topic
    const { topic } = req.body;

    const prompt = `
    You are a creative assistant tasked with generating contexts for a given topic. 
    The topic is: "${topic}".
    Provide exactly 3 distinct, realistic, and detailed scenarios or contexts related to this topic. 
    Format your response as an array of strings, where each string is a concise description of one context.
    Example:
    If the topic is "F1":
    ["Two cars overtaking each other in a thrilling race", "Booking tickets for an F1 Grand Prix event", "Discussing DRS (Drag Reduction System) strategy in the pit lane"]
    Now generate the 3 contexts for the topic: "${topic}".
    `;

    try {
        const completions = await model.generateContent(prompt);

        const cleanContexts = completions.response
            .text()
            .split("\n")
            .reduce((acc, line) => {
                const match = line.match(/"(.*)"/);
                if (match) {
                    acc.push(match[1]);
                }
                return acc;
            }, []);

        res.json({ cleanContexts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/phrasesWithContext", async (req, res) => {
    const { userId, topic, context } = req.body;

    const prompt = `You are two people having a conversation about the topic "${topic}".

    Generate a dialogue about the topic "${topic}" between two speakers, 
    using the context: "${context}",
    labeled as "Person A" and "Person B". Format each response as: 
    Person A: [line]
    Person B: [line]`;

    try {
        const completions = await model.generateContent(prompt);

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

        const newPhrase = new Phrase({
            userId,
            topic,
            dialogues,
            createdAt: new Date(),
        });

        await newPhrase.save();

        const user = await User.findById(userId);
        user.learning.phrases.push(newPhrase._id);
        await user.save();

        res.status(201).json({ dialogues });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
