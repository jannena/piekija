const circulationRouter = require("express").Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Location = require("../models/Location");

circulationRouter.post("/loan", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { user: userId, item: itemId } = req.body;

    if (!userId || !itemId) return res.status(404).json({ error: "user or item is missing" });

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId).populate("loantype");

        if (!user) return res.status(400).json({ error: "user does not exist" });
        if (!item) return res.status(400).json({ error: "item does not exist" });

        if (item.loantype.canBeLoaned === false) return res.status(400).json({ error: "item cannot be loaned because of loantype" });

        console.log(user.loans[0], typeof user.loans[0], item._id, typeof item._id);
        if (user.loans && user.loans.some(l => l.toString() === item._id.toString())) return res.status(400).json({ error: "user has already loaned this item" });


        if (item.state === "loaned" && item.statePersonInCharge !== null) return res.status(400).json({ error: "item has already been loaned" });

        user.loans.push(item._id);
        if (user.loanHistoryRetention === true) user.loanHistory = [...user.loanHistory, {
            item: item._id.toString(),
            loaned: new Date(),
            returned: null
        }];
        item.statePersonInCharge = user._id;
        item.stateTimesRenewed = 0;
        item.state = "loaned";

        item.lastLoaned = new Date();
        item.loanTimes = item.loanTimes + 1 || 1;

        const dueDate = new Date();
        dueDate.setUTCDate(dueDate.getUTCDate() + (item.loantype.loanTime || 1));
        item.stateDueDate = dueDate;

        // TODO: Populate

        const location = await Location.findById(item.location);
        location.totalLoanCount = (location.totalLoanCount + 1) || 1;

        await location.save();
        await user.save();
        await item.save();

        // TODO: Send only relevant data
        res.json({ user, item });
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.post("/return", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { item: itemId } = req.body;

    if (!itemId) return res.status(400).json({ error: "item is missing" });

    try {
        const item = await Item.findById(itemId);
        if (!item) return res.status(400).json({ error: "item does not exist" });

        // if (!item.statePersonInCharge) return res.status(400).json({ error: "item has not been loaned" });
        const user = await User.findById(item.statePersonInCharge);
        if (!user) return res.status(400).json({ error: "item has not been loaned" });
        // TODO: Remove from every possible place where can be marked as loaned

        // console.log(typeof user.loans[0]._id.toString(), typeof itemId, user.loans[0]._id.toString() === itemId);
        user.loans = user.loans.filter(l => l.toString() !== itemId);
        if (user.loanHistoryRetention === true && user.loanHistory) user.loanHistory = user.loanHistory
            .map(h => (h.returned === null && h.item.toString() === item._id.toString()) ? {
                item: h.item,
                loaned: h.loaned,
                returned: new Date()
            } : h);
        item.statePersonInCharge = null;
        item.stateDueDate = null;
        item.stateTimesRenewed = null;
        item.state = "not loaned";

        await user.save();
        await item.save();

        res.status(200).end();
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.post("/renew", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { item: itemId } = req.body;

    try {
        const item = await Item.findById(itemId).populate("loantype");
        if (item.statePersonInCharge.toString() === req.authenticated._id.toString() || req.authenticated.staff === true) console.log("You can renew this item");
        else return res.status(403).json({ error: "you cannot renew this loan" });

        const { loanTime, renewTimes } = item.loantype;
        if (item.stateTimesRenewed >= renewTimes) return res.status(400).json({ error: "renewTimes exeeded" });

        const dueDate = new Date();
        dueDate.setUTCDate(dueDate.getUTCDate() + (loanTime || 1));
        item.stateDueDate = dueDate;
        console.log("item.stateTimesRenewed", item.stateTimesRenewed);
        item.stateTimesRenewed = item.stateTimesRenewed + 1 || 1;

        item.loanTimes = item.loanTimes + 1 || 1;
        item.lastLoaned = new Date();

        const location = await Location.findById(item.location);
        location.totalLoanCount = (location.totalLoanCount + 1) || 1;

        await location.save();
        await item.save();

        res.json({ id: itemId, dueDate });
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.post("/hold", (req, res, next) => {
    const { item: itemId } = req.body;
});

circulationRouter.delete("/hold", (req, res, next) => {

});

module.exports = circulationRouter;