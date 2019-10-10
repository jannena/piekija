const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

noteSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("note", noteSchema);