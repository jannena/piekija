const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
        required: true
    },
    score: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6]
    },
    review: {
        type: String
    }
});

ReviewSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        ret.holds = (ret.holds || 0).length;
    }
});

module.exports = mongoose.model("Review", ReviewSchema);