const statisticsRouter = require("express").Router();

const Item = require("../models/Item");
const Record = require("../models/Record");
const User = require("../models/User");
const Location = require("../models/Location");

statisticsRouter.post("/total", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    try {
        const stats = {
            items: await Item.countDocuments({}).then(n => n),
            records: await Record.countDocuments({}).then(n => n),
            users: await User.countDocuments({}).then(n => n)
        };

        res.json(stats);
    }
    catch (err) {
        next(err);
    }
});

statisticsRouter.post("/totalLoans", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    try {
        const locations = await Location.find({});
        res.json(locations.map(loc => [loc.name, loc.totalLoanCount || 0]));
    }
    catch (err) {
        next(err);
    }
});

statisticsRouter.post("/notLoanedSince", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { location, shelfLocation, date, language } = req.body;

    if (!location || !date) return res.status(400).json({ error: "location or date is missing" });

    try {
        const items = await Item
            .find({ location, lastLoaned: { $lte: new Date(date) } }, { barcode: 1, record: 1 })
            .populate("record", { title: 1, author: 1 })
            .sort({ "record.author": -1 });

        res.json({
            title: `Items not loaned since ${date}`,
            items: items.map(i => [i.barcode, i.record.title, i.record.author])
        })
    }
    catch (err) {
        next(err);
    }
});

module.exports = statisticsRouter;