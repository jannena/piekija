const { ObjectId } = require("mongoose").Types;
const shelfRouter = require("express").Router();
const Shelf = require("../models/Shelf");
const User = require("../models/User");

shelfRouter.get("/", (req, res, next) => {
    Shelf
        .find({})
        .then(result => void res.json(result))
        .catch(next);
});

shelfRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        // TODO: Is this the best way to do this?
        const shelf = await Shelf.findOne({
            _id: id,
            $or: [
                { public: true },
                { author: req.authenticated && req.authenticated._id },
                { sharedWith: req.authenticated && req.authenticated._id }
            ]
        })
            .populate("records.record", { title: 1 })
            .populate("author", { name: 1 });

        if (!shelf) return res.status(404).end();

        if (shelf.author._id.toString() == (req.authenticated && req.authenticated._id)) {
            await Shelf.populate(shelf, {
                path: "sharedWith",
                select: { name: 1 }
            });
            return res.json(shelf);
        }
        else {
            const withoutShared = shelf.toJSON();
            delete withoutShared.sharedWith;
            return res.json(withoutShared);
        }
    }
    catch (err) {
        next(err);
    }
});

shelfRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { name, description = "", public: publicity } = req.body;

    if (!name || publicity === undefined) return res.status(400).json({ error: "name or public is missing" });

    const newShelf = new Shelf({
        name,
        description,
        public: publicity,
        author: req.authenticated._id,
        records: [],
        sharedWith: []
    });

    try {
        const savedShelf = await newShelf.save();

        const user = { ...req.authenticated };
        user.shelves.push({
            id: savedShelf._id,
            author: true
        });
        await user.save();

        savedShelf.populate({
            path: "author",
            select: "name"
        });

        res.status(201).json(savedShelf);
    }
    catch (err) {
        next(err);
    }
});

// TODO: Fix bad http error codes
shelfRouter.post("/:id/shelve", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const id = req.params.id;
    const { record, note = "" } = req.body;

    if (!record) return res.status(400).json({ error: "record is missing" });

    Shelf
        .findOneAndUpdate({
            _id: id,
            "records.record": { $ne: record },
            $or: [
                { author: req.authenticated._id },
                { sharedWith: req.authenticated._id }
            ]
        }, { $push: { records: { record, note } } }, { new: true })
        .then(result => {
            if (!result) return next(new Error("FORBIDDEN"));
            else res.status(201).json({ record, note });
        })
        .catch(next);
});

shelfRouter.post("/:id/share", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const id = req.params.id;

    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "username is missing" });

    try {
        const shelf = await Shelf.findOne({ _id: id, author: new ObjectId(req.authenticated._id) });
        console.log(new ObjectId(req.authenticated._id), id);
        if (!shelf) return res.status(404).end();

        const userToShareWith = await User.findOne({ username });
        if (!userToShareWith) return res.status(400).json({ error: "user does not exist" });

        console.log(shelf.sharedWith[0], typeof shelf.sharedWith[0], userToShareWith._id, typeof userToShareWith._id);
        if (shelf.sharedWith.some(s => s.toString() === userToShareWith._id.toString()))
            return res.status(400).json({ error: "already shared with this user" });

        if (shelf.author.toString() === userToShareWith._id.toString())
            return res.status(400).json({ error: "cannot share with the author" });

        // Add user to shelf document and shelf to user document
        shelf.sharedWith.push(userToShareWith._id);
        userToShareWith.shelves.push({
            id: shelf._id,
            author: false
        });

        await shelf.save();
        await userToShareWith.save();
        res.status(201).end();;
    }
    catch (err) {
        next(err);
    }
});

shelfRouter.delete("/:id/share", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { id } = req.params;
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "username is missing" });

    try {
        const shelf = await Shelf.findOne({ _id: id, author: new ObjectId(req.authenticated._id) });
        if (!shelf) return res.status(404).end();

        const userToUnshareWith = await User.findOne({ username });
        if (!userToUnshareWith) return res.status(400).json({ error: "user not found" });

        // Delete shelf from user document and delete user from shelf document
        userToUnshareWith.shelves = userToUnshareWith.shelves.filter(s => s.id.toString() !== shelf._id.toString());
        shelf.sharedWith = shelf.sharedWith.filter(u => u.toString() !== userToUnshareWith._id.toString());

        await userToUnshareWith.save();
        await shelf.save();

        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

module.exports = shelfRouter;