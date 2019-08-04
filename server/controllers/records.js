const recordRouter = require("express").Router();
const Record = require("../models/Record");

const MARC21 = require("../utils/marc21parser");

// Get all records
recordRouter.get("/", (req, res, next) => {
    Record
        .find({})
        .then(result => {
            res.json(result);
        })
        .catch(next);
});

// Get one record
recordRouter.get("/:id", (req, res, next) => {
    const id = req.params.id;

    Record
        .findById(id)
        .populate({
            path: "items",
            populate: {
                path: "location"
            }
        })
        // .populate("items", { state: 1, location: 1 })
        .then(result => {
            if (result) res.json(result);
            else res.status(404).end();
        })
        .catch(next);
});

recordRouter.delete("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    Record
        .findByIdAndRemove(id)
        .then(() => {
            res.status("204").end();
        })
        .catch(next);
});

// Add new record to database
// This endpoint needs marc21 data. That will be parsed to the database.
recordRouter.post("/", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const body = req.body;

    const type = body.type;
    const data = body.data;

    if (!type) return res.status(400).json({ error: "type is missing" });
    if (!data) return res.status(400).json({ error: "data is missing" });

    let parsedMARC = {};
    try {
        parsedMARC = MARC21.parse(data);
    }
    catch (e) {
        return res.status(400).json({ error: "invalid marc21 data" });
    }

    const record = MARC21.parseMARCToDatabse(parsedMARC);

    const newRecord = new Record(record);

    newRecord
        .save()
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(next);
});

recordRouter.put("/:id", (req, res) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));


});

module.exports = recordRouter;