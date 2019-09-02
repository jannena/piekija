const loginRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const otp = require("speakeasy");

loginRouter.post("/", async (req, res, next) => {
    try {
        const { username, password, code } = req.body;
        if (!username || !password) return res.status(400).json({ error: "username or password is missing" });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "wrong username or password" });

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) return res.status(401).json({ error: "wrong username or password" });

        if (user.TFACode) {
            if (!code) return res.status(400).json({ error: "code needed" });
            else {
                const verified = otp.totp.verify({
                    encoding: "base32",
                    secret: user.TFACode,
                    token: code
                })
                if (!verified) return res.status(401).json({ error: "invalid code" });
            }
        }

        const tokenData = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(tokenData, config.SECRET);

        res.status(200).json({
            token,
            ...tokenData
        });
    }
    catch (err) {
        next(err);
    }
});

module.exports = loginRouter;