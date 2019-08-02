const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authentication = require("../middleware/authentication");

userRouter.use(authentication);

userRouter.get("/me", (req, res) => {
    if (!req.authenticated) return res.status(401).json({ error: "you must login first" });

    res.send(req.authenticated);
});

userRouter.get("/", (req, res) => {
    User
        .find({})
        .then(result => void res.json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

userRouter.get("/:id", (req, res) => {
    const id = req.params.id;

    User
        .findById(id)
        .then(result => {
            if (!result) return res.status(404).end();
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.json });
            console.log(err);
        });
});

// TODO: ?User search?

userRouter.post("/", async (req, res) => {
    const { name, username, staff, password, barcode } = req.body;

    if (!name || !username || staff === undefined || !password || !barcode)
        return res.status(400).json({ error: "name or username or staff or password or barcode is missing" });
    
    if (password.length < 10) return res.status(400).json({ error: "length of password must be at least 10 characters" });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
        name,
        username,
        staff,
        passwordHash,
        barcode,
        loans: [],
        shelves: []
    });

    newUser
        .save()
        .then(result => void res.status(201).json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

module.exports = userRouter;