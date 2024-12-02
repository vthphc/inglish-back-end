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
// 		        AIExplaination: String,
// 			},
// 		],
// 		createdAt: Date,
// 	},
// 	{ versionKey: false }
// );

//send questions (including questionname, questionoptions, correctanswer) and using the AI to explain the correct answer (why it is correct, grammar, etc.)
router.post("/", async (req, res) => {
    const { lessonId, questions } = req.body;

    const prompt = `
    You are a professional English teacher. Your task is to analyze and explain why the correct answers to the following questions are accurate. Focus on grammar, vocabulary, context, and reasoning. Provide detailed explanations for each question.

    Questions:
    ${questions
        .map((q, index) => {
            return `
    Question ${index + 1}:
    - Question Name: ${q.questionName}
    - Options: ${q.questionOptions.join(", ")}
    - Correct Answer: ${q.correctAnswer}

    Explanation:`;
        })
        .join("\n")}
    `;

    try {
        const completions = await model.generateContent({ prompt });
        console.log(completions);

        const explanations = completions.response
            .text()
            .trim()
            .split("\n")
            .filter((line) => line.trim() !== "");

        // update questions with AI explanations and save to the database
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { $set: { questions: explanations } },
            { new: true }
        );

        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while generating explanations.",
            error,
        });
    }
});

module.exports = router;
