const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Shelf = require("../models/Shelf");
const Record = require("../models/Record");
const Item = require("../models/Item");
const Location = require("../models/Location");
const Loantype = require("../models/Loantype");
const Review = require("../models/Review");
const Note = require("../models/Note");

const { escapedMARC21Data } = require("../tests/api/testutils");
const { parseMARCToDatabse, tryParse } = require("../utils/marc21parser");

router.post("/reset", async (req, res) => {
    await User.deleteMany({});
    await Shelf.deleteMany({});
    await Record.deleteMany({});
    await Item.deleteMany({});
    await Location.deleteMany({});
    await Loantype.deleteMany({});
    await Review.deleteMany({});
    await Note.deleteMany({});

    const admin = new User({
        name: "Admin User",
        username: "adminuser",
        passwordHash: await bcrypt.hash("salasana", 13),
        barcode: "adminuser",
        loans: [],
        holds: [],
        loanHistoryRetention: true,
        loanHistory: [],
        connectedAccounts: [],
        shelves: [],
        staff: true
    });
    await admin.save();

    const user = new User({
        name: "Basic User",
        username: "basicuser",
        passwordHash: await bcrypt.hash("salasana", 13),
        barcode: "basicuser",
        loans: [],
        holds: [],
        loanHistoryRetention: true,
        loanHistory: [],
        connectedAccounts: [],
        shelves: []
    });
    await user.save();

    const user2 = new User({
        name: "Usic Baser ",
        username: "usicbaser",
        passwordHash: await bcrypt.hash("salasana", 13),
        barcode: "usicbaser",
        loans: [],
        holds: [],
        loanHistoryRetention: true,
        loanHistory: [],
        connectedAccounts: [],
        shelves: []
    });
    await user2.save();

    const parsed1 = tryParse(escapedMARC21Data[0]);
    const record1 = new Record({
        ...(await parseMARCToDatabse(parsed1, escapedMARC21Data[0])),
        ai: 1
    });
    await record1.save();

    const parsed2 = tryParse(escapedMARC21Data[1]);
    const record2 = new Record({
        ...(await parseMARCToDatabse(parsed2, escapedMARC21Data[1])),
        ai: 2
    });
    await record2.save();

    const note = new Note({
        title: "This is the first note",
        content: "This is the content of the first note",
        created: new Date(),
        modified: new Date()
    });
    await note.save();

    res.end();
});

router.post("/initrecords", async (req, res) => {
    const lt = new Loantype({
        name: "This is a loantype",
        canBeLoaned: true,
        canBePlacedAHold: true,
        renewTimes: 10,
        loanTime: 10
    });
    const loantype = await lt.save();

    const lc = new Location({
        name: "This is a location",
        totalLoanCount: 0
    });
    const location = await lc.save();

    const r = await Record.findOne({ title: "Imaginaerum" });

    const it1 = new Item({
        created: new Date(),
        record: r._id,
        location: location._id,
        loantype: loantype._id,
        barcode: "1/1",
        state: "not loaned",
        shelfLocation: "7 NIG",

        lastLoaned: new Date(0),
        loanTimes: 0
    });
    it1.save();

    const it2 = new Item({
        created: new Date(),
        record: r._id,
        location: location._id,
        loantype: loantype._id,
        barcode: "1/2",
        state: "not loaned",
        shelfLocation: "7 NIG",

        lastLoaned: new Date(0),
        loanTimes: 0
    });
    await it2.save();

    r.items = [it1._id, it2._id];
    await r.save();

    const r2 = await Record.findOne({ title: "Liitu-ukko" });

    const it3 = new Item({
        created: new Date(),
        record: r2._id,
        location: location._id,
        loantype: loantype._id,
        barcode: "2/1",
        state: "not loaned",
        shelfLocation: "7 NIG",

        lastLoaned: new Date(0),
        loanTimes: 0
    });
    await it3.save();

    const it4 = new Item({
        created: new Date(),
        record: r2._id,
        location: location._id,
        loantype: loantype._id,
        barcode: "2/2",
        state: "not loaned",
        shelfLocation: "7 NIG",

        lastLoaned: new Date(0),
        loanTimes: 0
    });
    await it4.save();

    r2.items = [it3._id, it4._id];
    await r2.save();

    const lc2 = new Location({
        name: "This is the second location",
        totalLoanCount: 0
    });
    await lc2.save();

    res.end();
});

module.exports = router;