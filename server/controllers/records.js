const recordRouter = require("express").Router();
const Record = require("../models/Record");
const Review = require("../models/Review");
const User = require("../models/User");

const MARC21 = require("../utils/marc21parser");

// Get one record
recordRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Record
            .findById(id, { reviews: { $slice: -10 }, /* items: 1, spelling1: 1, spelling2: 1, record: 1, reviews: 1, holds: 1 */ })
            .populate({
                path: "items",
                populate: {
                    path: "location"
                }
            })
            .populate({
                path: "items",
                populate: {
                    path: "loantype",
                }
            })
            .populate({
                path: "reviews",
                select: "reviewer review score record"
            });

        if (!result) return res.status(404).end();

        await Record.populate(result, {
            path: "reviews.reviewer",
            select: "name"
        });

        const record = result.toJSON();
        record.reviews = record.reviews.map(r => ({
            ...r,
            reviewer: {
                name: r.reviewer.name,
                id: r.reviewer.id
            }
        }));

        res.json(record);
    }
    catch (err) {
        next(err);
    }
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

recordRouter.post("/:id/review", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { id } = req.params;

    const { score, review } = req.body;

    if (!score || !review) return res.status(400).json({ error: "score or review is missing" });

    try {
        const usersReviewsForThisRecord = await Review.countDocuments({ record: id, reviewer: req.authenticated._id }).then(number => number);
        if (usersReviewsForThisRecord > 0) return res.status(400).json({ error: "user has already reviewed this record" });

        const record = await Record.findById(id);
        if (!record) return res.status(400).json({ error: "record not found" });

        const newReview = new Review({
            reviewer: req.authenticated._id,
            record: id,
            score,
            review
        });
        const saved = await newReview.save();

        await User.findByIdAndUpdate(req.authenticated._id, { $push: { reviews: saved._id } });

        const totalReviews = (record.totalReviews && record.totalReviews.average && record.totalReviews.reviews)
            ? {
                reviews: record.totalReviews.reviews + 1,
                average: (record.totalReviews.reviews * record.totalReviews.average + score) / (record.totalReviews.reviews + 1)
            }
            : {
                reviews: 1,
                average: score
            }
        await Record.findByIdAndUpdate(id, { $set: { totalReviews }, $push: { reviews: saved._id } });

        await Review.populate(saved, {
            path: "reviewer",
            select: "name"
        });

        const ret = saved.toJSON();
        console.log(ret);
        delete ret.reviewer.tfa;

        res.status(201).json(ret);
    }
    catch (err) {
        next(err);
    }
});

recordRouter.delete("/:id/review", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));

    const { id } = req.params;

    try {
        const review = await Review.findOne({ reviewer: req.authenticated._id, record: id });
        if (!review) return res.status(204).json();

        await Record.findByIdAndUpdate(id, { $pull: { reviews: review._id } });
        await User.findByIdAndUpdate(req.authenticated._id, { $pull: { reviews: review._id } });

        await Review.findByIdAndRemove(review._id);

        // TODO: Remember totalReviews

        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

module.exports = recordRouter;