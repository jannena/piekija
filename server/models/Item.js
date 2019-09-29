const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    barcode: {
        type: String,
        unique: true
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    loantype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loantype"
    },
    note: String,
    state: String,
    stateInfo: {
        type: {
            personInCharge: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            dueDate: Date
        }
    }
});

module.exports = mongoose.model("Item", itemSchema);