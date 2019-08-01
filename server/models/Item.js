const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    barcode: String,
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    loanType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanType"
    },
    ratings: [
        {
            comment: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
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