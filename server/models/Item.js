const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
    loantype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loantype",
        required: true
    },
    note: String,
    state: {
        type: String,
        required: true,
        enum: ["loaned", "not loaned", "broken", "placed a hold", "other"]
    },
    statePersonInCharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    stateDueDate: {
        type: Date
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