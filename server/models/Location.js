const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    totalLoanCount: {
        type: Number,
        required: true
    }
});

locationSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Location", locationSchema);