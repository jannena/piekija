const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/User");

const authentication = async (req, res, next) => {
    try {
        const authorization = req.get("authorization");
        console.log("Authorization", authorization);
        if (!authorization || !(authorization || "").toLowerCase().startsWith("bearer ")) {
            req.authenticated = null;
            next();
            return;
        }

        const token = jwt.verify(authorization.substring(7), config.SECRET);
        if (!token.id) {
            req.authenticated = null;
            return res.status(401).json({ error: "invalid token" });
        }

        const userLoggedIn = await User.findById(token.id);
        if (!userLoggedIn) {
            req.authenticated = null;
            return res.status(401).json({ error: "invalid token" });
        }

        console.log(userLoggedIn);

        req.authenticated = userLoggedIn;
    }
    catch (err) {
        next(err);
    }

    next();
};

module.exports = authentication;