const recordRouter = require("express").Router();
const Record = require("../models/Record");

const MARC21 = require("../utils/marc21parser");

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
        .populate({
            path: "items",
            populate: {
                path: "loantype"
            }
        })
        // .populate("items", { state: 1, location: 1 })
        .then(result => {
            if (result) res.json(result.toJSON());
            else res.status(404).end();
        })
        .catch(next);
});

recordRouter.delete("/:id", async (req, res, next) => {
    console.log("????????????????????????????????????", req.authenticated);
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    try {
        const record = await Record.findById(id);
        if (record.items.length !== 0) return res.status(409).json({ error: "there are items attached to this record" });

        await record.remove();
        res.status(204).end();

    }
    catch (err) {
        next(err);
    }

    Record
        .findByIdAndRemove(id)
        .then(() => {
            res.status("204").end();
        })
        .catch(next);
});

// Add new record to database
// This endpoint needs marc21 data. That will be parsed to the database.
recordRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { type, data, ai } = req.body;
    if (!type || !data) return res.status(400).json({ error: "type or data is missing" });

    console.log("received marc21 data", data);

    const parsedMARC = MARC21.tryParse(data);
    if (!parsedMARC) return res.status(400).json({ error: "invalid marc21 data" })
    const record = await MARC21.parseMARCToDatabse(parsedMARC, data);

    try {

        const newAI = ai && isFinite(ai) ? ai : ((await (Record.count({}).then(n => n))) + 1);

        const newRecord = new Record({ ...record, ai: newAI });
        const saved = await newRecord.save()
        res.status(201).json(saved.toJSON());
    }
    catch (err) {
        next(err);
    }
});

recordRouter.put("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { id } = req.params;

    const { type, data } = req.body;
    if (!type || !data) return res.status(400).json({ error: "type or data is missing" });

    const parsedMARC = MARC21.tryParse(data);
    if (!parsedMARC) return res.status(400).json({ error: "invalid marc21 data" })
    const { timeAdded, ...record } = await MARC21.parseMARCToDatabse(parsedMARC, data);
    console.log(record);

    Record
        .findByIdAndUpdate(id, record, { new: true })
        .populate({
            path: "items",
            populate: {
                path: "location"
            }
        })
        .then(result => {
            // const populatedResult = await Record.populate(result, { location: 1 });
            res.json(result.toJSON());
        })
        .catch(next);
});

module.exports = recordRouter;