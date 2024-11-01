const express = require("express");
const router = express.Router();
const User = require("../../models/users");

router.get("/", async (req, res) => {
    return res.json(req.user);
});

module.exports = router;
