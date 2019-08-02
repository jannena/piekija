const config = require("./utils/config");

const mongoose = require("mongoose");
const cors = require("cors");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const recordRouter = require("./controllers/records");
const locationRouter = require("./controllers/locations");
const itemRouter = require("./controllers/items");
const loantypeRouter = require("./controllers/loantypes");
const shelfRouter = require("./controllers/shelves");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const searchRouter = require("./controllers/search");

const validateQuery = require("./utils/queryValidator");

console.log(config.DATABASE_URI);

mongoose
    .connect(config.DATABASE_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected to database"))
    .catch(() => console.log("Could not connect to database"));
mongoose.set("useFindAndModify", true);

app.use(bodyParser.json());

app.use("/", express.static("build"));
app.use(cors());

app.use("/api/record", recordRouter);
app.use("/api/location", locationRouter);
app.use("/api/item", itemRouter);
app.use("/api/loantype", loantypeRouter);
app.use("/api/shelf", shelfRouter);
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/search", searchRouter);

app.get("/2", (req, res) => {
    res.json(validateQuery([
        "or", [
            ["and", [
                ["and", [
                    ["and", [
                        ["or", [
                            ["and", [
                                ["locations", "Suomi", "is"],
                                ["persons", "Matti", "contains"]
                            ]]
                        ]]
                    ]],
                    ["authors", "Joku", "contains"],
                    ["genres", "popmusiikki", "is"],
                    ["languages", "eng", "is"],
                    ["languages", "fin", "is"]
                ]]
            ]],
            ["title", "hei", "contains"],
            ["year", "2018", "is"],
            ["record", "lumme", "contains"]
        ]]
    ))
});

app.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});