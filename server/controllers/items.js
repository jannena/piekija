const itemRouter = require("express").Router();
const Item = require("../models/Item");
const Record = require("../models/Record");

itemRouter.get("/", (req, res, next) => {
    Item
        .find({})
        .populate("record", { title: 1, author: 1 })
        .populate("location", { name: 1 })
        .populate("loantype")
        .then(result => {
            res.json(result);
        })
        .catch(next);
});

itemRouter.post("/", async (req, res, next) => {
    const { record, location, loantype, state, note } = req.body;
    if (!record || !location || !loantype || !state)
        return res.status(400).json({ error: "record or location or loanType or state is missing" });

    const newItem = new Item({
        record,
        location,
        loantype,
        note: note ? note : "",
        state,
        ratings: [],
        stateInfo: {}
    });

    try {
        const recordOfItem = await Record.findById(record);
        if (!recordOfItem) return res.status(400).json({ error: "record does not exist" });

        // TODO: ?loanType check and location check?

        const savedItem = await newItem.save();

        // Add id of the added item to the record
        recordOfItem.items.push(savedItem._id);
        await recordOfItem.save();

        res.status(201).json(savedItem);
    }
    catch (err) {
        next(err);
    }
});

module.exports = itemRouter;