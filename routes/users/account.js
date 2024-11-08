const express = require("express");
const router = express.Router();
const User = require("../../models/users");

router.get("/", async (req, res) => {
	if (req.user) {
		console.log(req.user);
		return res.json(req.user);
	}
	res.status(401).json({
		errorCode: "EC0",
		errorMessage: "Token hết hạn/ không hợp lệ!",
	});
});

module.exports = router;
