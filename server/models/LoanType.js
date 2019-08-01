const mongoose = require("mongoose");

const loanTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    canBePlacedAHold: {
        type: Boolean,
        required: true
    },
    canBeLoaned: {
        type: Boolean,
        required: true
    },
    canBeRenewed: {
        type: Boolean,
        required: true
    },
    renewTimes: {
        type: Number,
        required: true
    },
    loanTime: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("LoanType", loanTypeSchema);