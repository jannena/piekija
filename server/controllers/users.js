const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Shelf = require("../models/Shelf");
const Item = require("../models/Item");
const otp = require("speakeasy");
const QRCode = require("qrcode");

userRouter.get("/me", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    try {
        await User.populate(req.authenticated, {
            path: "shelves.id loans holds.record",
            select: "name loantype record stateDueDate stateTimesRenewed title"
        });

        await User.populate(req.authenticated, {
            path: "loans.loantype loans.record",
            select: "title renewTimes"
        });

        await User.populate(req.authenticated, {
            path: "holds.record holds.location",
            select: "title holds name"
        });

        // const user = req.authenticated.toObject();

        const holds = [];

        for (let i = 0; i < req.authenticated.holds.length; i++) {
            const hold = req.authenticated.holds[i];

            const queue = hold.record.holds.map(h => h.toString()).indexOf(req.authenticated._id.toString());
            const itemForMe = await Item.findOne({ record: hold.record._id, stateHoldFor: req.authenticated._id });

            holds.push({
                location: {
                    id: hold.location._id,
                    name: hold.location.name
                },
                record: {
                    id: hold.record._id,
                    title: hold.record.title
                },
                queue: queue + 1,
                state: (itemForMe && itemForMe.state) || "placed a hold"
            });
        }

        // const holds = req.authenticated.holds.map(async hold => {
        //     console.log(hold);

        //     const queue = hold.record.holds.map(h => h.toString()).indexOf(req.authenticated._id.toString());

        //     const itemForMe = await Item.findOne({ record: hold.record._id, stateHoldFor: req.authenticated._id });

        //     return {
        //         location: {
        //             id: hold.location._id,
        //             name: hold.location.name
        //         },
        //         record: {
        //             id: hold.record._id,
        //             title: hold.record.title
        //         },
        //         queue: queue + 1,
        //         state: (itemForMe && itemForMe.state) || "placed a hold"
        //     };
        // });

        res.send({
            ...req.authenticated.toJSON(),
            holds
        });
    }
    catch (err) {
        return next(err);
    }
});

userRouter.get("/me/loanhistory", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    try {
        await User.populate(req.authenticated, {
            path: "loanHistory.record",
            select: "title id"
        });

        res.send(req.authenticated.loanHistory.filter(l => l.returned !== null));
    }
    catch (err) {
        return next(err);
    }
});



userRouter.put("/me", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    console.log("ruumis", req.body, req.authenticated);

    const { name, password, tfa, loanhistory, oldPassword } = req.body;

    if (!name && !password && tfa === undefined && loanhistory === undefined) return res.status(400).json({ error: "name and password and tfa and loanhistory are missing" });
    if (!oldPassword) return res.status(400).json({ error: "oldPassword is missing" });

    try {
        const usertoBeSaved = {};

        const passwordCorrect = await bcrypt.compare(oldPassword, req.authenticated.passwordHash);
        if (!passwordCorrect) return res.status(403).json({ error: "wrong oldPassword" });

        // Handle first two-factor authentication
        // Generate new secret for two-factor authentication
        if (tfa === true) {
            const secret = otp.generateSecret({ encoding: "base32" });
            await User.findByIdAndUpdate(req.authenticated._id, { $set: { TFACode: secret.base32 } })
            return QRCode.toDataURL(secret.otpauth_url, (err, url) => {
                if (err) return next(err);
                res.json({ TFAQR: url });
            });
        }
        // Clear two-factor authentication
        else if (tfa === false) usertoBeSaved.TFACode = "";
        else if (tfa !== undefined) return res.status(400).json({ error: "tfa must be true or false" });

        // Loan history
        if (loanhistory === true) usertoBeSaved.loanHistoryRetention = loanhistory;
        else if (loanhistory === false) {
            usertoBeSaved.loanHistoryRetention = false;
            usertoBeSaved.loanHistory = [];
        }

        // Then, everything else but two-factor authentication
        if (password && password.length < 10) return res.status(400).json({ error: "password too short" });
        if (password) usertoBeSaved.passwordHash = await bcrypt.hash(password, 13);

        if (name) usertoBeSaved.name = name;

        const modifiedUser = await User.findByIdAndUpdate(req.authenticated.id, { $set: usertoBeSaved }, { new: true });
        await User.populate(modifiedUser, {
            path: "shelves.id",
            select: "name"
        });
        res.json(modifiedUser.toJSON());
    }
    catch (err) {
        next(err);
    }
});


// userRouter.get("/", (req, res, next) => {
//     if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
//     if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

//     User
//         .find({})
//         .then(result => void res.json(result))
//         .catch(next);
// });

userRouter.get("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    User
        .findById(id)
        .populate("holds.$.record", { title: 1 })
        .populate("holds.$.location", { name: 1 })
        .then(result => {
            if (!result) return res.status(404).end();
            else {
                const { tfa, ...sendable } = result.toJSON();
                console.log("sendable", sendable);
                res.json(sendable);
            }
        })
        .catch(next);
});


userRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { name, username, password, barcode } = req.body;

    if (!name || !username || !password || !barcode)
        return res.status(400).json({ error: "name or username or password or barcode is missing" });

    if (password.length < 10) return res.status(400).json({ error: "length of password must be at least 10 characters" });

    try {
        const passwordHash = await bcrypt.hash(password, 13);

        const newUser = new User({
            name,
            username,
            passwordHash,
            barcode,
            loans: [],
            holds: [],
            loanHistoryRetention: true,
            loanHistory: [],
            connectedAccounts: [],
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
    const { username, name, password, barcode } = req.body;

    const modifiedUser = {};

    try {
        if (password && password.length < 10) return res.status(400).json({ error: "password too short" });
        if (password) {
            const passwordHash = await bcrypt.hash(password, 13);
            modifiedUser.passwordHash = passwordHash;
        }

        if (username) modifiedUser.username = username;
        if (name) modifiedUser.name = name;
        if (barcode) modifiedUser.barcode = barcode;

        User
            .findByIdAndUpdate(id, { $set: modifiedUser }, { new: true })
            .then(result => {
                const { tfa, ...sendable } = result.toJSON();
                res.json(sendable);
            })
            .catch(next);
    }
    catch (err) {
        next(err);
    }
});

userRouter.delete("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    try {
        const user = await User.findById(id);
        if (user.loans.length !== 0) return res.status(409).json({ error: "user have active loans" });

        await Shelf.deleteMany({ author: id });

        await user.remove();

        res.status(204).end();
    }
    catch (err) {
        next(err);
    }

    User
        .findByIdAndRemove(id)
        .then(() => void res.status(204).end())
        .catch(next);
});

userRouter.post("/search", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { barcode, name } = req.body;

    if (!barcode && !name) return res.status(400).json({ error: "barcode and name missing" });

    const query = barcode ? { barcode } : { name };

    try {
        const result = await User
            .find(query, { shelves: 0 })
            .populate({
                path: "loans",
                populate: {
                    path: "record location loantype",
                    select: "title name renewTimes"
                }
            });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});

module.exports = userRouter;