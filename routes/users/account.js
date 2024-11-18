const express = require("express");
const router = express.Router();
const User = require("../../models/users");

router.get("/", async (req, res) => {
	if (req.user) {
		console.log("/account api:", req.user);
		return res.json(req.user);
	}
	res.status(401).json({
		errorCode: "EC0",
		errorMessage: "Token hết hạn/ không hợp lệ!",
	});
});

router.post("/exam/:examId", async (req, res) => {
	if (req.user) {
		const { userId } = req.user;
		const { examId } = req.params;
		const { score } = req.body;
		console.log(
			"/account/exam api:",
			req.user,
			"\n",
			"ExamID: ",
			examId,
			"\n",
			"Score: ",
			score
		);
		try {
			const user = await User.findById(userId);
			console.log(user);
			if (!user) {
				return res.status(404).json({
					errorCode: "EC1",
					errorMessage: "User not found",
				});
			}

			const examIndex = user.examsTaken.findIndex(
				(exam) => exam.examId.toString() === examId
			);
			if (examIndex !== -1) {
				// return res.status(400).json({
				// 	errorCode: "EC2",
				// 	errorMessage: "Exam already taken",
				// });
				user.examsTaken[examIndex].score = score;
				await user.save();
				return res.status(200).json({ user });
			}

			user.examsTaken.push({ examId, score });
			await user.save();
			return res.status(200).json({ user });
		} catch (error) {
			console.error(
				"Error fetching user or exams taken:",
				error
			);
			return res.status(500).json({
				errorCode: "EC0",
				errorMessage: "Internal server error",
			});
		}
	}
});

module.exports = router;
