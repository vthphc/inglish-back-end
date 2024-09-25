const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../../models/users");

const JWT_SECRET = "inglish_uit_jwt_secret";
const JWT_SECRET_REFRESH = "inglish_uit_jwt_secret_refresh";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};

//register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username: username });

        if (existing) {
            return res.status(401).json({ message: "Username already taken" });
        }

        if (password.length < 8 || password.includes(" ")) {
            return res.status(402).json({ message: "Invalid password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            username: username,
            password: hashedPassword,
        });

        await user.save();

        res.json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res
                .status(403)
                .json({ message: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(403)
                .json({ message: "Invalid username or password" });
        }

        const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, {
            expiresIn: "1h",
        });

        const refreshToken = jwt.sign(
            { username: user.username },
            JWT_SECRET_REFRESH,
            { expiresIn: "7d" }
        );

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
