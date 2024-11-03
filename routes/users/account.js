const express = require("express");
const router = express.Router();
const User = require("../../models/users");

router.get("/", async (req, res) => {
	if (req.user) {
		console.log(req.user);
		return res.json(req.user);
	}
	res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
