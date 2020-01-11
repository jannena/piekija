const mongoose = require("mongoose");
const config = require("../config");

const MARC21 = require("../marc21parser");

const run = async () => {
    try {
        await mongoose.connect(config.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

        const Record = require("../../models/Record");

        const records = await Record.find({}, { record: 1 });
        const recordsLength = records.length;
        const printPerCentMod = Math.max(Math.round(recordsLength / 100), 1);

        console.log("Records in database: ", recordsLength);
        if (recordsLength >= 1000000) console.log("There are many records in database!"); // TODO: What to do?
        for (let i = 0; i < recordsLength; i++) {
            try {
                const parsed = MARC21.tryParse(records[i].record);
                await Record.findByIdAndUpdate(records[i]._id, MARC21.parseMARCToDatabse(parsed, records[i].record));
            }
            catch (err) {
                console.log(err);
            }
            if (i % printPerCentMod === 0) console.log(`${((i + 1) / recordsLength * 100).toFixed(0)}% ready`);
        }
    }
    catch (err) {
        console.log(err);
    }

    mongoose.connection.close();
    console.log("100% ready");
};

run();