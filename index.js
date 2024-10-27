const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt_auth = require("./middleware/jwt_auth");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DB_URL;

app.use(cors());
app.use(bodyParser.json());
app.all("*", jwt_auth);
//Xài middleware này trên tất cả routes để xác thực là đã có người dùng đăng nhập (đã có token),
//nếu muốn truy cập tất cả các routes thì comment lại code app.all() trên

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
