const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const readline = require("readline");

const path = require("path");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const lines = [
    "MongoDB database URI: ",
    "Performance limit [10000]: ",
    "Admin username: ",
    "Admin password: "
];
const values = [];
let i = 0;

console.log("\r\nDid you run command 'npm install'?\r\n\r\n");

console.log(lines[i]);
rl.on("line", line => {
    values.push(line);
    if (i >= lines.length - 1) {
        rl.close();
        return run(values);
    }
    i++;
    console.log(lines[i]);
});

const run = async (values) => {
    const config = [
        `SECRET=${crypto.randomBytes(32).toString("hex")}`,
        `DATABASE_URI=${values[0]}`,
        "TEST_DATABASE_URI=",
        `PERFORMANCE_LIMIT=${values[1] || 10000}`,
        ``,
        "GOOGLE_USE_GOOGLE_LOGIN=false",
        "GOOGLE_CLIENT_ID=null",
        "GOOGLE_CLIENT_SECRET=null",
        "GOOGLE_REDIRECT_URI=null",
        "",
        "ENABLE_GRAPHQL=false",
        "",
        "ENABLE_ALL_CORS=false",
        "CORS_ORIGIN=http://localhost:3000;http://example.com",
        "",
        "PORT=3001"
    ];

    console.log("\r\n\r\nYOUR CONFIGURATION FILE\r\n------");
    console.log(config.join("\r\n"));
    console.log("------\r\n\r\n");

    const configFile = path.resolve(__dirname + "/../../../.env");
    console.log(`\r\nCONFIG FILE: ${configFile}\r\n`);

    console.log(fs.existsSync(configFile)
        ? "Config file already exists. Another one will not be created. \r\n\r\n"
        : "Config file does not exist. Creating...\r\n");
    if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, config.join("\n"));

    await mongoose.connect(values[0], { useNewUrlParser: true, useUnifiedTopology: true });

    const User = require("../../models/User");

    const adminUser = new User({
        staff: true,
        barcode: "admin",
        name: "Admin",
        username: values[2],
        passwordHash: await bcrypt.hash(values[3], 13),
        loanHistoryRetention: true,
        loanHistory: [],
        holds: [],
        loans: []
    });
    try {
        await adminUser.save();
        console.log("\r\nNow, you can log in with");
        console.log("Username: ", values[2]);
        console.log("Password: ", values[3]);
    }
    catch (err) {
        console.log(err);
        console.log("\r\n\r\nCould not add admin user!");
        console.log("1) Is Mongodb database uri correct?");
        console.log("2) Have you already run this script and succesfully added admin user?");
    }

    mongoose.connection.close();

    // console.log("Installed successfully");
};