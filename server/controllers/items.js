const itemRouter = require("express").Router();
const Item = require("../models/Item");
const Record = require("../models/Record");

itemRouter.get("/", (req, res, next) => {
    // TODO: authorization
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
    // TODO: authorization
    const { record, location, loantype, state, note } = req.body;
    if (!record || !location || !loantype || !state)
        return res.status(400).json({ error: "record or location or loantype or state is missing" });

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

itemRouter.put("/:id", (req, res, next) => {
    // TODO: authorization
    const { id } = req.params;
    const { location, loantype, state, note } = req.body;
    console.log(location, loantype, state, note);
    if (!location || !loantype || !state || note === undefined)
        return res.status(400).json({ error: "location or loantype or state or note is missing" });

    const updatedItem = {
        location,
        loantype,
        state,
        note
    };

    Item
        .findByIdAndUpdate(id, updatedItem, { new: true })
        .then(result => {
            res.json(result);
        })
        .catch(next);
});

itemRouter.delete("/:id", async (req, res, next) => {
    // TODO: authorization
    const { id } = req.params;

    try {
        const item = await Item.findByIdAndRemove(id);
        await Record.findByIdAndUpdate(item.record, { $pull: { items: id } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

module.exports = itemRouter;