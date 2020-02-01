const locationRouter = require("express").Router();
const Location = require("../models/Location");
const Item = require("../models/Item");

// locationRouter.get("/:id", (req, res, next) => {
//     const id = req.params.id;

//     Location
//         .findById(id)
//         .then(result => {
//             if (result) return res.json(result.toJSON());
//             else res.status(404).end();
//         })
//         .catch(next);
// });

locationRouter.get("/", (req, res, next) => {
    Location
        .find({})
        .then(result => void res.json(result.map(r => r.toJSON())))
        .catch(next);
});

locationRouter.post("/", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "name is missing" });

    const newLocation = new Location({
        name,
        totalLoanCount: 0
    });
    newLocation
        .save()
        .then(result => {
            res.status(201).json(result.toJSON());
        })
        .catch(next);
});

locationRouter.put("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "name is missing" });

    Location
        .findByIdAndUpdate(id, { name }, { new: true })
        .then(result => void res.json(result.toJSON()))
        .catch(next);
});

locationRouter.delete("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    try {
        const itemUsingThisLocation = await Item.findOne({ location: id });

        console.log("Removing location", id, itemUsingThisLocation);

        if (itemUsingThisLocation) return res.status(409).json({ error: "there are items using this location" });
    }
    catch (err) {
        return next(err);
    }

    Location
        .findByIdAndRemove(id)
        .then(() => void res.status(204).end())
        .catch(next);
});

module.exports = locationRouter;