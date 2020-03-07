const circulationRouter = require("express").Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Record = require("../models/Record");
const Location = require("../models/Location");
const Loantype = require("../models/Loantype");

circulationRouter.post("/loan", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { user: userId, item: itemId } = req.body;

    if (!userId || !itemId) return res.status(404).json({ error: "user or item is missing" });

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId)
            .populate("loantype")
            .populate("location")
            .populate("record", { title: 1, author: 1 });

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

        user.holds = user.holds.filter(hold => hold.record.toString() !== item.record._id.toString());

        // TODO: Populate

        const location = await Location.findById(item.location);
        location.totalLoanCount = (location.totalLoanCount + 1) || 1;

        await location.save();
        await user.save();
        await item.save();

        await Item.populate(item, {
            path: "statePersonInCharge",
            select: { name: true, username: true, barcode: true }
        })

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
        const item = await Item.findById(itemId)
            .populate("loantype")
            .populate("location")
            .populate("record", { title: 1, author: 1 });
        if (!item) return res.status(400).json({ error: "item does not exist" });

        const record = await Record.findById(item.record);

        // if (!item.statePersonInCharge) return res.status(400).json({ error: "item has not been loaned" });
        const user = await User.findById(item.statePersonInCharge);
        if (!user) return res.status(400).json({ error: "item has not been loaned" });
        // TODO: Remove from every possible place where can be marked as loaned


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
        item.stateHoldFor = null;

        if (record.holds.length > 0) item.state = "placed a hold";
        else item.state = "not loaned";

        await user.save();
        await item.save();

        await Item.populate(item, {
            path: "statePersonInCharge",
            select: "name username barcode"
        })

        res.status(200).json(item);
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

        const record = await Record.findById(item.record);
        if (record.holds.length > 0) return res.status(400).json({ error: "there are holds" });

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

        console.log("trying", recordId, "already", req.authenticated.holds.map(hold => hold.record.toString()).join(", "));

        // if (req.authenticated.holds.some(hold => hold.record.toString() === recordId.toString()))
        //     return res.status(400).json({ error: "cannot place a hold for item you have already loaned" });

        const location = await Location.findById(locationId);
        if (!location) return res.status(400).json({ error: "Invalid location" });

        const items = await Item.find({ record: recordId }, { state: 1, loantype: 1 });
        if (items.length === 0) return res.status(400).json({ error: "there are not items attached to this record" });

        await Item.populate(items, {
            path: "loantype",
            select: "canBePlacedAHold"
        });

        const potentialItems = items
            .filter(i => i.loantype.canBePlacedAHold === true && (["loaned", "not loaned", "placed a hold", "being carried", "pick-up"].indexOf(i.state) > -1))
            .map(i => i._id);

        // TODO: Jos tila on 'lainassa', ei saa muuttaa tilaksi 'varattu'

        if (potentialItems.length === 0) return res.status(400).json({ error: "loantype denies placing a hold for any items of this record" });

        record.holds = [...record.holds, req.authenticated._id];

        req.authenticated.holds = [...req.authenticated.holds, {
            record: record._id,
            location: location._id
        }];

        console.log(req.authenticated.holds);
        console.log(potentialItems);

        if (record.holds.length === 1) await Item.updateMany(
            { _id: { $in: potentialItems }, state: { $nin: ["loaned", "being carried", "pick-up"] } },
            { $set: { state: "placed a hold", stateFirstHoldLocation: locationId } }
        );

        await req.authenticated.save();
        await record.save();

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

        const itemReserverdForUser = await Item.findOne({ record: recordId, stateHoldFor: req.authenticated._id });
        if (itemReserverdForUser) return res.status(400).json({ error: "Hold can not be removed anymore" });

        const isCurrentUserFirstHolder = (record.holds[0] && record.holds[0].toString()) === req.authenticated._id.toString();

        record.holds = (record.holds || []).filter(h => h.toString() !== req.authenticated._id.toString());

        req.authenticated.holds = req.authenticated.holds.filter(h => h.record.toString() !== record._id.toString());

        if (record.holds.length === 0) {
            await Item.updateMany(
                { record: recordId, state: "placed a hold" },
                { $set: { state: "not loaned", stateFirstHoldLocation: null } }
            );
        }
        else if (isCurrentUserFirstHolder) {
            const nextFirstHolder = await User.findById(record.holds[0]);
            const nextPickupLocation = nextFirstHolder.holds.filter(hold => hold.record.toString() === record._id.toString());
            await Item.updateMany(
                { record: recordId, state: "placed a hold" },
                { $set: { state: "placed a hold", stateFirstHoldLocation: nextPickupLocation[0].location } }
            );
        }

        await record.save();
        await req.authenticated.save();

        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.put("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { item: itemId, location: locationId } = req.body;
    if (!itemId || !locationId) return res.status(400).json({ error: "item or location is missing" });

    try {
        const item = await Item.findById(itemId)
            .populate("loantype")
            .populate("location")
            .populate("record", { title: 1, author: 1 });

        const record = await Record.findById(item.record);

        const isForCurrentLocation = item.stateFirstHoldLocation.toString() === locationId;

        switch (item.state) {
            case "placed a hold":
                if (isForCurrentLocation) item.state = "pick-up";
                else item.state = "being carried";

                item.stateHoldFor = record.holds[0] || null;

                await item.save();

                record.holds = record.holds.slice(1);
                await record.save();

                if (record.holds.length === 0) await Item.updateMany({ _id: { $in: record.items }, state: "placed a hold" }, { $set: { state: "not loaned" } });
                break;

            case "being carried":
                if (isForCurrentLocation) {
                    item.state = "pick-up";
                    await item.save();

                    record.holds = record.holds.slice(1);
                    await record.save();
                }
                else {
                    return res.status(400).json({ error: "current location is not the pick-up location if the item" });
                }
                break;

            default:
                return res.status(400).json({ error: "item does not have state 'placed a hold' or 'being carried'" });
        }

        await Item.populate(item, {
            path: "stateHoldFor stateFirstHoldLocation",
            select: { name: 1, username: 1, barcode: 1 }
        });

        res.json(item);
    }
    catch (err) {
        next(err);
    }
});

circulationRouter.patch("/hold", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const { location: locationId } = req.body;

    if (!locationId) return res.status(400).json({ error: "location is missing" });

    try {
        const goodLoantypes = (await Loantype.find({ canBeLoaned: true, canBePlacedAHold: true })).map(lt => lt._id);
        const { items } = (await Item
            .find(
                { location: locationId, state: "placed a hold", statePersonInCharge: null, loantype: { $in: goodLoantypes } },
                { barcode: 1, record: 1, shelfLocation: 1 }
            )
            .limit(50)
            .populate("record", "title author holds")
            .populate("stateFirstHoldLocation", "name")
        )
            .map(item => ({
                barcode: item.barcode,
                shelfLocation: item.shelfLocation,
                pickupLocation: item.stateFirstHoldLocation,
                record: {
                    id: item.record.id,
                    title: item.record.title,
                    author: item.record.author,
                    for: item.record.holds[0]
                },
                queue: item.record.holds.length
            }))
            .reduce(({ items, records }, add) => {
                if (records.some(r => r === add.record.id.toString())) return { items, records };
                return {
                    items: [...items, add],
                    records: [...records, add.record.id.toString()]
                };
            }, { items: [], records: [] })

        res.send(items);
    }
    catch (err) {
        next(err);
    }

    // TODO: Palauta kaikki aktiiviset varaukset
});

module.exports = circulationRouter;