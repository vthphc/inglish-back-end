const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Lesson = require("../../models/lessons");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const lessonSchema = new mongoose.Schema(
// 	{
// 		title: String,
// 		type: String,
// 		contentURL: String,
// 		questions: [
// 			{
// 				questionName: String,
// 				questionOptions: [String],
// 				correctAnswer: String,
// 		        AIExplanation: String,
// 			},
// 		],
// 		createdAt: Date,
// 	},
// 	{ versionKey: false }
// );

//send questions (including questionname, questionoptions, correctanswer) and using the AI to explain the correct answer (why it is correct, grammar, etc.)
router.post("/reading", async (req, res) => {
    try {
        const { lessonId, questions } = req.body;

        // Validate input
        if (!lessonId || !Array.isArray(questions)) {
            return res.status(400).json({
                message:
                    "Invalid request. 'lessonId' and 'questions' are required.",
            });
        }

        // Generate explanations for each question
        const updatedQuestions = await Promise.all(
            questions.map(async (question) => {
                const prompt = `
                    Provide a brief, single-line explanation for why "${
                        question.correctAnswer
                    }" is the correct word in the sentence: "${
                    question.questionName
                }". 
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
                        .replace(/^\w/, (c) => c.toUpperCase());

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

        // Update the lesson in the database
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { $set: { questions: updatedQuestions } },
            { new: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ message: "Lesson not found." });
        }

        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error("Error in API route:", error);

        res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
});

module.exports = router;
