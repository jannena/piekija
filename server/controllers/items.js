const itemRouter = require("express").Router();
const Item = require("../models/Item");
const Record = require("../models/Record");

itemRouter.get("/", (req, res) => {
    Item
        .find({})
        .populate("record")
        .populate("location")
        .populate("loanType")
        .then(result => void res.json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

itemRouter.post("/", async (req, res) => {
    const { record, location, loanType, state } = req.body;
    if (!record || !location || !loanType || !state)
        return res.status(400).json({ error: "record or location or loanType or state is missing" });

    const newItem = new Item({
        record,
        location,
        loanType,
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
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = itemRouter;