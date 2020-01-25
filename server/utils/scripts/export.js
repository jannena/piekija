const mongoose = require("mongoose");
const config = require("../config");

const fs = require("fs");
const path = require("path");

const Record = require("../../models/Record");
const Location = require("../../models/Location");
const Loantype = require("../../models/Loantype");
const Item = require("../../models/Item");

const run = async () => {
    try {
        await mongoose.connect(config.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

        console.log("This script will back up:");
        console.log(` * records (${(await Record.countDocuments({}).then(n => n))})`);
        console.log(` * items (${(await Item.countDocuments({}).then(n => n))})`);
        console.log(` * locations (${(await Location.countDocuments({}).then(n => n))})`);
        console.log(` * loantypes (${(await Loantype.countDocuments({}).then(n => n))}).`);
        console.log("");
        console.log("Shelves, users and frontpage news will NOT be backed up.");
        console.log("");
        console.log("Be sure that there is enough RAM!");
        console.log("");

        const records = await Record.find({}, { record: 1, ai: 1 });
        const locations = await Location.find({}, { name: 1 });
        const loantypes = await Loantype.find({});
        const items = await Item.find({}, { created: 1, barcode: 1, record: 1, location: 1, loantype: 1, shelfLocation: 1, state: 1,note: 1 });

        const ready = {
            records,
            locations,
            loantypes,
            items
        };

        const d = new Date();
        fs.writeFileSync(path.resolve(__dirname, `./../../../piekija-backup-${d.getFullYear()}-${d.getMonth()}-${d.getDay()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.json`), JSON.stringify(ready));

    }
    catch (err) {
        console.log(err);
    }
    mongoose.connection.close();
};

run();