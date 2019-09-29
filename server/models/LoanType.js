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
    renewTimes: {
        type: Number,
        required: true
    },
    loanTime: {
        type: Number,
        required: true
    }
});

loanTypeSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Loantype", loanTypeSchema);