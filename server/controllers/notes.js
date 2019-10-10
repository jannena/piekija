const noteRouter = require("express").Router();
const Note = require("../models/Note");

// Returns 5 last notes
noteRouter.get("/last", (req, res, next) => {
    Note
        .find({})
        .limit(5)
        .then(result => {
            res.json(result.map(r => r.toJSON()));
        })
        .catch(next);
});

noteRouter.get("/", (req, res, next) => {
    Note
        .find({})
        .then(result => {
            res.json(result.map(r => r.toJSON()))
        })
        .catch(next);
});

noteRouter.post("/", (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) return res.status(400).json({ error: "title or content missing" });

    const newNote = new Note({
        title,
        content,
        created: new Date(),
        modified: new Date()
    });

    newNote
        .save()
        .then(result => {
            res.status(201).json(result.toJSON());
        })
        .catch(next);
});

noteRouter.put("/:id", (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) return res.status(400).json({ error: "title or content missing" });

    Note
        .findByIdAndUpdate(id, { title, content, modified: new Date() }, { new: true })
        .then(result => {
            res.json(result.toJSON());
        }).
        catch(next);
});

noteRouter.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    Note
        .findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(next);
});

module.exports = noteRouter;