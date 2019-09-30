const circulationRouter = require("express").Router();

const User = require("../models/User");
const Item = require("../models/Item");

circulationRouter.post("/loan", async (req, res, next) => {
    // TODO: authorization
    const { user: userId, item: itemId } = req.body;

    if (!userId || !itemId) return res.status(404).json({ error: "user or item is missing" });

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (!user) return res.status(400).json({ error: "user does not exist" });
        if (!item) return res.status(400).json({ error: "record does not exist" });
        console.log(user.loans[0], typeof user.loans[0], item._id, typeof item._id);
        if (user.loans && user.loans.some(l => l._id.toString() === item._id.toString())) return res.status(400).json({ error: "user has already loaned this item" });


        // TODO: Check whether item is already loaned!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (item.state === "loaned" && item.statePersonInCharge !== null) return res.status(400).json({ error: "item has already been loaned" });

        user.loans.push({ item: item._id });
        item.statePersonInCharge = user._id;
        item.stateDueDate = new Date();
        item.state = "loaned";

        // TODO: Populate 

        await user.save();
        await item.save();

        res.json({ user, item });
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.post("/return", async (req, res, next) => {
    // TODO: authorization
    const { item: itemId } = req.body;

    if (!itemId) return res.status(400).json({ error: "item is missing" });

    try {
        const item = await Item.findById(itemId);
        if (!item) return res.status(400).json({ error: "item does not exist" });

        const user = await User.findById(item.statePersonInCharge);
        if (!user) return res.status(400).json({ error: "item has not been loaned" });

        // console.log(typeof user.loans[0]._id.toString(), typeof itemId, user.loans[0]._id.toString() === itemId);
        user.loans = user.loans.filter(l => l.item._id.toString() !== itemId);
        item.statePersonInCharge = null;
        item.stateDueDate = null;
        item.state = "not loaned";

        await user.save();
        await item.save();

        res.status(200).end();
    }
    catch (err) {
        next(err);
    }
});

// TODO: renew: circulationRouter.post("/renew", (req, res, next) => {});

// TODO: place a hold: circulationRouter.post("/?", (req, res, next) => {});

module.exports = circulationRouter;