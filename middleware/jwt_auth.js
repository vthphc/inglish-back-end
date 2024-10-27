const jwt = require("jsonwebtoken");

const jwt_auth = (req, res, next) => {
    const white_list = ["/auth/login", "/auth/register", "/"];
    if (white_list.find((item) => item === req.originalUrl)) {
        next();
    } else {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // console.log("Token: ", token);
            //Verify
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("Decoded: ", decoded);
                next();
            } catch (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
};

module.exports = jwt_auth;
