const locationRouter = require("express").Router();
const Location = require("../models/Location");

locationRouter.get("/:id", (req, res, next) => {
    const id = req.params.id;

    Location
        .findById(id)
        .then(result => {
            if (result) return res.json(result);
            else res.status(404).end();
        })
        .catch(next);
});

locationRouter.get("/", (req, res, next) => {
    Location
        .find({})
        .then(result => void res.json(result))
        .catch(next);
});

locationRouter.post("/", (req, res, next) => {
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
        .catch(next);
});

locationRouter.delete("/:id", (req, res, next) => {
    const id = req.params.id;

    Location
        .findByIdAndRemove(id)
        .then(() => void res.status(204).end())
        .catch(next);
});

module.exports = locationRouter;