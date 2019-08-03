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

const errorHandler = require("./middleware/error");
const { authenticationMiddleware } = require("./middleware/authentication");

console.log(config.DATABASE_URI);

mongoose
    .connect(config.DATABASE_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected to database"))
    .catch(() => console.log("Could not connect to database"));
mongoose.set("useFindAndModify", true);

app.use(bodyParser.json());

app.use("/", express.static("build"));
app.use(cors());

app.use(authenticationMiddleware);

app.use("/api/record", recordRouter);
app.use("/api/location", locationRouter);
app.use("/api/item", itemRouter);
app.use("/api/loantype", loantypeRouter);
app.use("/api/shelf", shelfRouter);
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/search", searchRouter);

app.use(errorHandler);

module.exports = app;