const locationRouter = require("express").Router();
const Location = require("../models/Location");

locationRouter.get("/:id", (req, res) => {
    const id = req.params.id;

    Location
        .findById(id)
        .then(result => {
            if (result) return res.json(result);
            else res.status(404).end();
        })
        .catch(err => {
            req.status(400).json({ error: err.message });
            console.log(err);
        });
});

locationRouter.get("/", (req, res) => {
    Location
        .find({})
        .then(result => void res.json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

locationRouter.post("/", (req, res) => {
    const body = req.body;
    const locationName = body.name;

    if (!locationName) return res.status(400).json({ error: "name is missing" });

    const newLocation = new Location({
        name: locationName
    });
    newLocation
        .save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
            console.log(err);
        });
});

locationRouter.delete("/:id", (req, res) => {
    const id = req.params.id;

    Location
        .findByIdAndRemove(id)
        .then(() => void res.status(204).end())
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

module.exports = locationRouter;