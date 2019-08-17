const fs = require("fs");
const mongoose = require("mongoose");

const Record = require("../models/Record");
const MARC21 = require("./marc21parser");

const config = require("./config");

console.log("Connecting to...", config.DATABASE_URI);

mongoose
    .connect(config.DATABASE_URI, { useNewUrlParser: true })
    .then(async () => {
        console.log("connected to database");
        run();
    })
    .catch((err) => console.log("Error while connecting to database", err));


const run = async () => {
    let file = fs.readFileSync("G:\\harvard\\data\\hlom\\data\\hlom\\ab.bib.00.20180316.full.mrc");

    let success = 0;
    let error = 0;

    console.log("Record file size:    ", file.length);

    let records = file.toString().split("\u001d");
    const length = records.length;
    console.log("Records:             ", length);
    file = null;
    for (let i = 0; i < records.length; i++) {
        let data = records[i];
        if (i % 10000 === 0) console.log("Saved into database: ", Math.round(100 * i / length), "%");
        try {
            const parsedMARC = MARC21.tryParse(data);
            if (!parsedMARC) console.log("Invalid MARC21", i);
            const record = MARC21.parseMARCToDatabse(parsedMARC, data);
            // if (i === 0) console.log(record);

            const newRecord = new Record(record);
            await newRecord.save();
            success++;
            records[i] = null;
            data = null;
        }
        catch (err) {
            console.log("error while saving to db", err);
            error++;
        }
    }
    // records.forEach(async (data, i) => {

    // });

    console.log("Error:               ", error);
    console.log("Success:             ", success);

    mongoose.connection.close();
};