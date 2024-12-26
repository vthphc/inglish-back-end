const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/generateContext", async (req, res) => {
    //take the topic, give 5 contexts that could be used for the topic
    const { topic } = req.body;

    const prompt = `You are two people having a conversation about the topic "${topic}". 
    Generate 5 contexts/scenery that could be used/happened for the topic "${topic}".
    The response should be an array of 5 strings. 
    
    Example for topic "shopping":
    ["Shopping mall", "Supermarket", "Online shopping", "Black Friday", "Window shopping"]
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
    const { topic, context } = req.body;

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

        res.json({ dialogues });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/lessonsAIExplanation", async (req, res) => {
    try {
        const { questions } = req.body;

        const updatedQuestions = await Promise.all(
            questions.map(async (question) => {
                const prompt = `
                    Provide a brief, single-line explanation for why "${question.correctAnswer}" is the correct answer for this question: "${question.questionName}".
                     
                    Options are: ${question.questionOptions.join(", ")}. 
                    Explain succinctly why other options are incorrect.`;

                try {
                    // Generate AI explanations
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    let text = response
                        .text()
                        .trim()
                        .replace(/^["']/, "") // Remove leading quotation marks
                        .replace(/["']$/, "") // Remove trailing quotation marks
                        .replace(/\\/g, "") // Remove backslashes
                        .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first character

                    return {
                        ...question,
                        AIExplanation:
                            text.trim() || "No explanation provided by AI",
                    };
                } catch (error) {
                    console.error("Error generating explanation:", error);
                    return {
                        ...question,
                        AIExplanation: "Error generating AI explanation",
                    };
                }
            })
        );

        res.json(
            updatedQuestions.map((question) => ({
                questionName: question.questionName,
                AIExplanation: question.AIExplanation,
            }))
        );
    } catch (error) {
        console.error("Error in API route:", error);

        res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
});

module.exports = router;
