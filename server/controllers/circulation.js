const circulationRouter = require("express").Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Record = require("../models/Record");
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

        // TODO: Tarkista varaukset

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


        // TODO: Siirrä varausjonoa eteenpäin


        // console.log(typeof user.loans[0]._id.toString(), typeof itemId, user.loans[0]._id.toString() === itemId);
        user.loans = user.loans.filter(l => l.toString() !== itemId);
        if (user.loanHistoryRetention === true && user.loanHistory) user.loanHistory = user.loanHistory
            .map(h => (h.returned === null && h.item.toString() === item._id.toString()) ? {
                item: h.item,
                record: item.record,
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

        // TODO: Tarkista varaukset

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

circulationRouter.post("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { record: recordId, location: locationId } = req.body;

    if (!recordId || !locationId) return res.status(400).json({ error: "record or location is missing" });

    try {
        const record = await Record.findById(recordId);
        if (!record) return res.status(400).json({ error: "record does not exist" });
        if (record.holds.some(h => h.toString() === req.authenticated._id.toString()))
            return res.status(400).json({ error: "current user has already placed a hold for this item" });

        const location = await Location.findById(locationId);
        if (!location) return res.status(400).json({ error: "Invalid location" });

        const items = await Item.find({ record: recordId }, { state: 1, loantype: 1 });
        if (items.length === 0) return res.status(400).json({ error: "there are not items attached to this record" });

        await Item.populate(items, {
            path: "loantype",
            select: "canBePlacedAHold"
        });

        const potentialItems = items
            .filter(i => i.loantype.canBePlacedAHold === true && (i.state === "not loaned" || i.state === "placed a hold"))
            .map(i => i._id);

        if (potentialItems.length === 0) return res.status(400).json({ error: "loantype denies placing a hold for any items of this record" });

        record.holds = [...record.holds, req.authenticated._id];

        req.authenticated.holds = [...req.authenticated.holds, {
            record: record._id,
            queue: record.holds.length,
            location: location._id
        }];

        console.log(req.authenticated.holds);

        console.log(potentialItems);
        await Item.updateMany({ _id: { $in: potentialItems } }, { $set: { state: "placed a hold" } });

        await req.authenticated.save();
        await record.save();

        // TODO: Lisää johonkin tieto, että henkilökunta tietää toimia varauksen eteen.

        res.status(201).json({
            record: {
                id: record._id,
                title: record.title
            },
            queue: record.holds.length,
            location: {
                name: location.name,
                id: location._id
            }
        });
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.delete("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { record: recordId } = req.body;
    if (!recordId) return res.status(400).json({ error: "record is missing" });

    try {
        const record = await Record.findById(recordId);
        if (!record) return res.status(400).json({ error: "record does not exist" });
        // if (!record.holds || record.holds.length === 0) return res.status(400).json({ error: "no holds" });

        record.holds = (record.holds || []).filter(h => h.toString() !== req.authenticated._id.toString());

        req.authenticated.holds = req.authenticated.holds.filter(h => h.record.toString() !== record._id.toString());

        if (record.holds.length === 0) {
            await Item.updateMany({ record: recordId, state: "placed a hold" }, { $set: { state: "not loaned" } });
        }

        await record.save();
        await req.authenticated.save();


        // TODO: Päivitä vuoronumerot

        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.put("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { barcode } = req.body;

    // TODO: Varaa tietty nimike käyttäjälle

});

circulationRouter.get("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    // TODO: Palauta kaikki aktiiviset varaukset
});

module.exports = circulationRouter;