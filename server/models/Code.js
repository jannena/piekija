const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true
    },
    giveMe: {
        type: String,
        required: true
    },
    iReturn: {
        type: String,
        required: true
    }
});

codeSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Code", codeSchema);