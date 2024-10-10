const express = require("express");
const router = express.Router();

const Phonetic = require("../../models/phonetics");

router.get("/", async (req, res) => {
    try {
        const phonetics = await Phonetic.find();
        res.json(phonetics);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/", async (req, res) => {
    const phonetic = new Phonetic({
        type: req.body.type,
        symbol: req.body.symbol,
        sound: req.body.sound,
        example: req.body.example,
    });

    try {
        const savedPhonetic = await phonetic.save();
        res.json(savedPhonetic);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
