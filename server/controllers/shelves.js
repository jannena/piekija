const shelfRouter = require("express").Router();
const Shelf = require("../models/Shelf");

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
            })
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
        user.shelves.push(savedShelf._id);
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

shelfRouter.post("/:id/shelve", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const id = req.params.id;
    const { record, note = "" } = req.body;

    if (!record) return res.status(400).json({ error: "record is missing" });

    Shelf
        .findOneAndUpdate({
            _id: id,
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

module.exports = shelfRouter;