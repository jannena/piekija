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

shelfRouter.post("/", (req, res, next) => {
    const { name, public } = req.body;

    if (!name || public === undefined) return res.status(400).json({ error: "name or public is missing" });

    const newShelf = new Shelf({
        name,
        public,
        author: "", // TODO: logged in user
        records: [],
        sharedWith: []
    });

    // TODO: Add shelf to user's document

    newShelf
        .save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(next);
});

module.exports = shelfRouter;