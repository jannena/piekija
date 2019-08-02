const mongoose = require("mongoose");

const shelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelf",
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

module.exports = mongoose.model("Shelf", shelfSchema);