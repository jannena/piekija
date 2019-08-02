const shelfRouter = require("express").Router();
const Shelf = require("../models/Shelf");

shelfRouter.get("/", (req, res) => {
    Shelf
        .find({})
        .then(result => void res.json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

shelfRouter.get("/:id", (req, res) => {
    const id = req.params.id;

    Shelf
        .findOneById(id)
        .then(result => {
            if (!result) return res.status(404).end();
            else res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

shelfRouter.post("/", (req, res) => {
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
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

module.exports = shelfRouter;