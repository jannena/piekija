const mongoose = require("mongoose");
const config = require("../config");

const fs = require("fs");

const Record = require("../../models/Record");
const Location = require("../../models/Location");
const Loantype = require("../../models/Loantype");
const Item = require("../../models/Item");

const marc21 = require("../marc21parser");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log("A full address of the backup file: ");
rl.on("line", line => {
    rl.close();
    run(line);
});

const run = async file => {
    try {
        const data = JSON.parse(fs.readFileSync(file));

        console.log("This script will import:");
        console.log(` * records (${data.records.length})`);
        console.log(` * items (${data.items.length})`);
        console.log(` * locations (${data.locations.length})`);
        console.log(` * loantypes (${data.loantypes.length}).`);
        console.log("");

        await mongoose.connect(config.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

        const realRecordIds = {};
        const realLocationIds = {};
        const realLoantypeIds = {};


        // records
        for (let i = 0; i < data.records.length; i++) {
            const r = data.records[i];
            try {
                const parsedMARC = marc21.tryParse(r.record);
                // console.log(parsedMARC);
                // console.log(marc21.parseMARCToDatabse(parsedMARC, r.record));
                const newRecord = new Record({ ...(await marc21.parseMARCToDatabse(parsedMARC, r.record)), ai: r.ai });
                const saved = await newRecord.save();
                realRecordIds[r.id] = saved._id.toString();
            }
            catch (err) {
                console.log(`Could not import record ${r.id}!`, err);
                continue;
            }
        }

        // locations
        for (let i = 0; i < data.locations.length; i++) {
            const l = data.locations[i];
            try {
                const newLocation = new Location({
                    name: l.name,
                    totalLoanCount: 0
                });
                const saved = await newLocation.save();
                realLocationIds[l.id] = saved._id.toString();
            }
            catch (err) {
                console.log(`Could not import location ${l.id}!`, err);
                continue;
            }
        }

        // loantypes
        for (let i = 0; i < data.loantypes.length; i++) {
            const l = data.loantypes[i];
            try {
                const newLoantype = new Loantype({
                    name: l.name,
                    canBePlacedAHold: l.canBePlacedAHold,
                    canBeLoaned: l.canBeLoaned,
                    renewTimes: l.renewTimes,
                    loanTime: l.loanTime
                });
                const saved = await newLoantype.save();
                realLoantypeIds[l.id] = saved._id.toString();
            }
            catch (err) {
                console.log(`Could not import loantype ${l.id}!`, err);
                continue;
            }
        }

        // items
        for (let i = 0; i < data.items.length; i++) {
            const it = data.items[i];
            try {
                const newItem = new Item({
                    created: it.created,
                    barcode: it.barcode,
                    record: realRecordIds[it.record],
                    location: realLocationIds[it.location],
                    loantype: realLoantypeIds[it.loantype],
                    note: it.note || "",
                    state: it.state,
                    shelfLocation: it.shelfLocation,

                    statePersonInCharge: null,
                    stateDueDate: null,
                    stateTimesRenewed: null,

                    loanHistory: [],
                    lastLoaned: new Date(0),
                    loanTimes: 0
                });
                const saved = await newItem.save();

                await Record.findByIdAndUpdate(realRecordIds[it.record], { $push: { items: saved._id } });
            }
            catch (err) {
                console.log(`Could not import item ${it.id}!`, err);
                continue;
            }
        }

        // console.log(realLoantypeIds, realLocationIds, realRecordIds);

        console.log("");
        console.log("Ready!");
        console.log(` * records (${Math.floor(100 * ((await Record.countDocuments({}).then(n => n)) / data.records.length))}%)`);
        console.log(` * items (${Math.floor(100 * ((await Item.countDocuments({}).then(n => n)) / data.items.length))}%)`);
        console.log(` * locations (${Math.floor(100 * ((await Location.countDocuments({}).then(n => n)) / data.locations.length))}%)`);
        console.log(` * loantypes (${Math.floor(100 * ((await Loantype.countDocuments({}).then(n => n)) / data.loantypes.length))}%).`);
    }
    catch (err) {
        console.log(err);
    }


    mongoose.connection.close();
};