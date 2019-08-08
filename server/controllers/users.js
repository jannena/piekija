const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const otp = require("speakeasy");

userRouter.get("/me", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    try {
        await User.populate(req.authenticated, {
            path: "shelves.id",
            select: "name"
        });

        res.send(req.authenticated);
    }
    catch (err) {
        return next(err);
    }
});


// TODO: Add old password
userRouter.put("/me", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { name, password, tfa, oldPassword } = req.body;

    if (!name && !password && tfa === undefined) return res.status(400).json({ error: "name and password and tfa are missing" });
    if (!oldPassword) return res.status(400).json({ error: "oldPassword is missing" });

    try {
        const usertoBeSaved = {};

        if (password && password.length < 10) return res.status(400).json({ error: "password too short" });
        if (password) usertoBeSaved.passwordHash = await bcrypt.hash(password, 13);

        // Generate new secret for two-factor authentication
        if (tfa === true) usertoBeSaved.TFACode = otp.generateSecret({ encoding: "base32" }).base32;
        // Clear two-factor authentication
        else if (tfa === false) usertoBeSaved.TFACode = "";
        else return res.status(400).json({ error: "tfa must be true or false" });

        if (name) usertoBeSaved.name = name;

        const passwordCorrect = await bcrypt.compare(oldPassword, req.authenticated.passwordHash);
        if (!passwordCorrect) return res.status(403).json({ error: "wrong oldPassword" });

        const modifiedUser = await User.findByIdAndUpdate(req.authenticated.id, { $set: usertoBeSaved }, { new: true });
        res.json(modifiedUser.toJSON());
    }
    catch (err) {
        next(err);
    }
});


userRouter.get("/", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    User
        .find({})
        .then(result => void res.json(result))
        .catch(next);
});

userRouter.get("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    User
        .findById(id)
        .then(result => {
            if (!result) return res.status(404).end();
            else res.json(result);
        })
        .catch(next);
});

// TODO: ?User search?

userRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { name, username, staff, password, barcode } = req.body;

    if (!name || !username || staff === undefined || !password || !barcode)
        return res.status(400).json({ error: "name or username or staff or password or barcode is missing" });

    if (password.length < 10) return res.status(400).json({ error: "length of password must be at least 10 characters" });

    try {
        const passwordHash = await bcrypt.hash(password, 13);

        const newUser = new User({
            name,
            username,
            staff,
            passwordHash,
            barcode,
            loans: [],
            shelves: []
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        next(err);
    }
});

userRouter.put("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;
    const { username, name, password, staff, barcode } = req.body;

    const modifiedUser = {};

    try {
        if (password && password.length < 10) return res.status(400).json({ error: "password too short" });
        if (password) {
            const passwordHash = await bcrypt.hash(password, 13);
            modifiedUser.passwordHash = passwordHash;
        }

        if (username) modifiedUser.username = username;
        if (name) modifiedUser.name = name;
        if (staff !== undefined) modifiedUser.staff = staff;
        if (barcode) modifiedUser.barcode = barcode;

        User
            .findByIdAndUpdate(id, { $set: modifiedUser }, { new: true })
            .then(result => void res.json(result.toJSON()))
            .catch(next);
    }
    catch (err) {
        next(err);
    }
});

userRouter.delete("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    User
        .findByIdAndRemove(id)
        .then(() => void res.status(204).end())
        .catch(next);
});

module.exports = userRouter;