const config = require("./utils/config");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const recordRouter = require("./controllers/records");

console.log(config.DATABASE_URI);

mongoose
    .connect(config.DATABASE_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected to database"))
    .catch(() => console.log("Could not connect to database"));
mongoose.set("useFindAndModify", true);

app.use(bodyParser.json());

app.use("/api/record", recordRouter);

app.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});