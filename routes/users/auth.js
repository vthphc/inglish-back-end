require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../../models/users");

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         req.user = decoded;
//         next();
//     });
// };

//register
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existing = await User.findOne({ email: email });

        if (existing) {
            return res.status(401).json({ message: "Email in use!" });
        }

        if (password.length < 8 || password.includes(" ")) {
            return res.status(402).json({ message: "Invalid password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        username,
        password: hashedPassword,
        learning: {
            games: [],
            flashcards: [],
            phrases: [],
        },
        examsTaken: [],
        createdAt: new Date(),
    });

    try {
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(403)
                .json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(403)
                .json({ message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { email: user.email, username: user.username, userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const refreshToken = jwt.sign(
            { email: user.email, username: user.username, userId: user._id },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: "7d" }
        );

        return res.json({
            user: {
                email: user.email,
                username: user.username,
                userId: user._id,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
