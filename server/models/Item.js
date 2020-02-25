const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    shelfLocation: {
        type: "String",
        required: true
    },
    loantype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loantype",
        required: true
    },
    note: String,
    state: {
        type: String,
        required: true,
        enum: ["not in use", "loaned", "not loaned", "broken", "placed a hold", "being carried", "pick-up", "other"]
    },
    statePersonInCharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    stateDueDate: {
        type: Date
    },
    stateTimesRenewed: {
        type: Number
    },
    stateHoldFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    stateFirstHoldLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    loanHistory: Array,
    lastLoaned: {
        required: true,
        type: Date
    },
    loanTimes: {
        required: true,
        type: Number
    }
});

itemSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Item", itemSchema);