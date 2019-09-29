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
        // return res.status(400).json({ error: "item has already been loaned" });

        user.loans.push(item._id);
        item.stateInfo = {
            personInCharge: user._id,
            dueDate: new Date()
        };

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

        const user = await User.findById(item.stateInfo.personInCharge);
        if (!user) return res.status(400).json({ error: "item has not been loaned" });

        // console.log(typeof user.loans[0]._id.toString(), typeof itemId, user.loans[0]._id.toString() === itemId);
        user.loans = user.loans.filter(l => l._id.toString() !== itemId);
        item.stateInfo = { personInCharge: null, dueDate: null };

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