const config = require("./utils/config");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const recordRouter = require("./controllers/records");
const searchRouter = require("./controllers/search");

const validateQuery = require("./utils/queryValidator");

console.log(config.DATABASE_URI);

mongoose
    .connect(config.DATABASE_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected to database"))
    .catch(() => console.log("Could not connect to database"));
mongoose.set("useFindAndModify", true);

app.use(bodyParser.json());

app.use("/api/record", recordRouter);
app.use("/api/search", searchRouter);

app.get("/2", (req, res) => {
    res.json(validateQuery([
        "and", [
            ["or", [
                ["recordType", "custom", "is"],
                ["subjects", "kissat", "is"],
                ["and", [
                    ["authors", "Mikko", "contains"],
                    ["locations", "Mikkeli", "is"]
                ]]
            ]],
            ["locations", "Tanska", "is"],
            ["persons", "Obel", "contains"]
        ]
    ]))
});

app.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});