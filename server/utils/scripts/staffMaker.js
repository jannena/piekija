const mongoose = require("mongoose");
const config = require("../config");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log("The sername of the user whoch will be promoted to staff: ");
rl.on("line", line => {
    rl.close();
    run(line);
});

const run = async username => {
    try {
        await mongoose.connect(config.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

        const User = require("../../models/User");
        await User.findOneAndUpdate({ username }, { $set: { staff: true } });

        console.log(`${username} is now a staff user!`);
    }
    catch (err) {
        console.log(err);
    }

    mongoose.connection.close();
};