const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
});

module.exports = mongoose.model("Location", locationSchema);