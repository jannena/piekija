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
        shelves: []
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

module.exports = router;