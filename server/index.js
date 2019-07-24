const express = require("express");
const app = express();

app.use("/", (req, res) => {
    res.send("Toimii!");
});

app.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});