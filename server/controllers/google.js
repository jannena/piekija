const googleRouter = require("express").Router();
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");

const config = require("../utils/config");

const User = require("../models/User");

const { GOOGLE_LOGIN: GOOGLE } = require("../utils/config");

const cookieParser = require("cookie-parser");
googleRouter.use(cookieParser())

googleRouter.use("/login", (req, res) => {
    if (!GOOGLE) return res.status(503).json({ error: "Google login is disabled" });

    res.redirect(`https://accounts.google.com/signin/oauth/identifier?response_type=code&redirect_uri=${GOOGLE.REDIRECT_URI}&client_id=${GOOGLE.CLIENT_ID}&scope=email&prompt=select_account&nonce=${"moikka"}`);
});

googleRouter.delete("/disconnect", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    try {
        await User.findByIdAndUpdate(req.authenticated._id, { $pull: { connectedAccounts: { account: "google" } } }, { multi: true });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

googleRouter.use("/", async (req, res, next) => {
    if (!GOOGLE) return res.status(503).json({ error: "Google login is disabled" });

    console.log("cookies", req.cookies);

    const tokenCookie = req.cookies["piekija-token"];
    console.log("Google login token", tokenCookie);

    let userId = null;
    try {
        const token = jwt.verify(tokenCookie || "0", config.SECRET);
        userId = token.id;
    }
    catch (err) {
        console.log(err);
    }

    console.log("Google login user ", userId);

    const { code } = req.query;

    try {
        const { data } = await axios.default.post(
            "https://oauth2.googleapis.com/token",
            qs.stringify({
                code,
                client_id: GOOGLE.CLIENT_ID,
                client_secret: GOOGLE.CLIENT_SECRET,
                grant_type: "authorization_code",
                redirect_uri: GOOGLE.REDIRECT_URI
            }),
            { headers: { contentType: "application/x-www-form-urlencoded" } }
        );
        const { access_token } = data;

        const { data: profile } = await axios.default.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: { Authorization: `Bearer ${access_token}` }
            }
        );

        if (!userId) {
            const userLogginIn = await User.findOne({ "connectedAccounts.accountId": profile.email });
            if (!userLogginIn) return res.redirect("//localhost:3000/login");
            console.log("Google login logged in", userLogginIn.name);

            const tokenData = {
                id: userLogginIn._id,
                username: userLogginIn.username
            };
            const token = jwt.sign(tokenData, config.SECRET);

            return res.cookie("piekija-token", token).redirect("//localhost:3000/set_token?token=" + token);
        }
        else {
            await User.findOneAndUpdate({ _id: userId, "connectedAccounts.accountId": { $ne: profile.email } }, {
                $push: {
                    connectedAccounts: {
                        account: "google",
                        accountId: profile.email,
                        data: {
                            image: profile.picture
                        }
                    }
                }
            });
            return res.redirect("//localhost:3000/user");
        }
    }
    catch (err) {
        next(err);
    }
});

module.exports = googleRouter;