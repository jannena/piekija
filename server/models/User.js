const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    staff: {
        type: Boolean,
        required: true,
        default: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true
    },
    loans: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item"
            }
        }
    ],
    shelves: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shelf"
        }
    ]
});

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("User", userSchema)