const itemRouter = require("express").Router();
const Item = require("../models/Item");
const Record = require("../models/Record");


// itemRouter.get("/", (req, res, next) => {
//     Item
//         .find({})
//         .populate("record", { title: 1, author: 1 })
//         .populate("location", { name: 1 })
//         .populate("loantype")
//         .then(result => {
//             res.json(result);
//         })
//         .catch(next);
// });

itemRouter.post("/", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { barcode, record, location, loantype, state, note, shelfLocation } = req.body;
    if (!barcode || !record || !location || !loantype || !state || !shelfLocation)
        return res.status(400).json({ error: "barcode or record or location or loantype or state or shelfLocation is missing" });

    const newItem = new Item({
        created: new Date(),
        barcode,
        record,
        location,
        loantype,
        note: note ? note : "",
        state,
        shelfLocation,

        statePersonInCharge: null,
        stateDueDate: null,
        stateTimesRenewed: null,

        loanHistory: [],
        lastLoaned: new Date(0),
        loanTimes: 0
    });

    try {
        const recordOfItem = await Record.findById(record);
        if (!recordOfItem) return res.status(400).json({ error: "record does not exist" });

        // TODO: ?loanType check and location check?

        const savedItem = await newItem.save();
        const populated1 = await Item.populate(savedItem, { path: "location" });
        const populatedItem = await Item.populate(populated1, { path: "loantype" });

        // Add id of the added item to the record
        recordOfItem.items.push(savedItem._id);
        await recordOfItem.save();

        res.status(201).json(populatedItem);
    }
    catch (err) {
        next(err);
    }
});

itemRouter.put("/:id", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { id } = req.params;
    const { location, loantype, state, note, shelfLocation } = req.body;
    console.log(location, loantype, state, note, shelfLocation);
    if (!location || !loantype || !state || note === undefined || !shelfLocation)
        return res.status(400).json({ error: "location or loantype or state or note or shelfLocation is missing" });

    const updatedItem = {
        location,
        loantype,
        state,
        note,
        shelfLocation
    };

    Item
        .findByIdAndUpdate(id, { $set: updatedItem }, { new: true })
        .populate("location")
        .populate("loantype")
        .then(result => {
            res.json(result);
        })
        .catch(next);
});

itemRouter.delete("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (item.state === "loaned") return res.status(400).json({ error: "item is loaned to a user" });

        await item.remove();
        await Record.findByIdAndUpdate(item.record, { $pull: { items: id } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});


itemRouter.post("/search", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { barcode } = req.body;

    if (!barcode) return res.status(400).json({ error: "barcode is missing" });

    Item
        .findOne({ barcode })
        .populate("statePersonInCharge", { name: true, username: true, barcode: true })
        .populate("loantype")
        .populate("record", { title: 1, author: 1 })
        .populate("location", { name: 1 })
        .populate("stateFirstHoldLocation", { name: 1 })
        .populate("stateHoldFor", { barcode: 1, name: 1 })
        /* .populate({
            path: "stateInfo.personInCharge",
            populate: {
                path: "personInCharge"
            }
        }) */
        .then(result => res.send(result))
        .catch(next);
});

module.exports = itemRouter;