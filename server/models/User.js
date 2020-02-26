const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // two-factor authentication
    TFACode: String,
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
        required: true,
        unique: true
    },
    loans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ],
    holds: [
        {
            record: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Record",
                required: true
            },
            location: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location",
                required: true
            }
        }
    ],
    loanHistoryRetention: {
        type: Boolean,
        required: true
    },
    loanHistory: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item"
            },
            record: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Record"
            },
            loaned: Date,
            returned: Date
        }
    ],
    connectedAccounts: [
        {
            account: {
                type: String,
                required: true,
                enum: ["google", "piekija"]
            },
            accountId: {
                type: String,
                required: true
            },
            data: {
                type: Object
            }
        }
    ],
    nonce: String,
    reviews: [
        {
            record: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Record"
            },
            review: {
                type: Number,
                required: true,
                enum: [1, 2, 3, 4, 5]
            }
        }
    ],
    shelves: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shelf"
            },
            author: {
                type: Boolean,
                required: true
            }
        }
    ]
});

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        ret.tfa = !!ret.TFACode;
        delete ret.TFACode;
        ret.loanHistory = null;
    }
});

module.exports = mongoose.model("User", userSchema);