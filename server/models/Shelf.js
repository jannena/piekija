const mongoose = require("mongoose");

const shelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    public: {
        type: Boolean,
        required: true,
        default: false
    },
    records: [
        {
            record: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Record"
            },
            note: String
        }
    ]
});

shelfSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Shelf", shelfSchema);