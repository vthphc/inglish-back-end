const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DB_URL;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
    console.log("Connected to database");
});

app.get("/", (req, res) => {
    res.json({ message: "This is inglish-API" });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.use("/completions", require("./routes/completions"));

app.use("/users", require("./routes/users/users"));
app.use("/auth", require("./routes/users/auth"));

app.use("/phrases", require("./routes/phrases/phrases"));
app.use("/phraseCompletion", require("./routes/phrases/phraseCompletion"));

app.use("/lessons", require("./routes/lessons/lessons"));