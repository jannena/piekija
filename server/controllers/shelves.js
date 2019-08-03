const shelfRouter = require("express").Router();
const Shelf = require("../models/Shelf");

shelfRouter.get("/", (req, res, next) => {
    Shelf
        .find({})
        .then(result => void res.json(result))
        .catch(next);
});

shelfRouter.get("/:id", (req, res, next) => {
    const id = req.params.id;

    Shelf
        .findOneById(id)
        .then(result => {
            if (!result) return res.status(404).end();
            else res.json(result);
        })
        .catch(next);
});

shelfRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) res.status(401).json({ error: "you must login first" });
    const { name, public: publicity } = req.body;

    if (!name || publicity === undefined) return res.status(400).json({ error: "name or public is missing" });

    const newShelf = new Shelf({
        name,
        public: publicity,
        author: req.authenticated._id, // TODO: logged in user
        records: [],
        sharedWith: []
    });

    // TODO: Error handling and fixing

    const savedShelf = await newShelf.save();

    const user = { ...req.authenticated };
    user.shelves.push(savedShelf._id);
    await user.save();

    res.status(201).json(savedShelf);
});

module.exports = shelfRouter;