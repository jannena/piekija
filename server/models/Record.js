
const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    // MARC21: 130 / 245
    title: {
        type: String,
        required: true
    },
    timeAdded: {
        type: Date,
        required: true
    },
    timeModified: {
        type: Date,
        required: true
    },
    image: {
        type: String
    },
    contentType: {
        type: String,
        required: true
    },

    // MARC21: 008: 07-10 / 11-14
    year: {
        type: Number,
        required: true
    },

    country: String,

    // MARC21: 100, 110
    author: {
        type: String
    },

    // MARC21: 700, 710
    authors: {
        type: [
            { type: String }
        ],
        required: true
    },
    // head language: MARC21: 008: 35-37
    language: {
        type: String,
        required: true
    },
    // other languages: MARC21: 041
    languages: {
        type: [
            { type: String }
        ],
        required: true
    },

    // MARC21: 655
    genres: {
        type: [
            { type: String }
        ],
        required: true
    },
    // MARC21: 650, ?653 (also locations and persons 651, 600, 610)
    subjects: {
        type: [
            { type: String }
        ],
        required: true
    },
    // TODO: How about other 600-662 fields?

    series: {
        type: [
            { type: String }
        ],
        required: true
    },
    classification: {
        type: [
            { type: String }
        ],
        required: true
    },
    standardCodes: {
        type: [
            { type: String }
        ],
        required: true
    },

    recordType: {
        type: String,
        required: true,
        enum: ["marc21", "custom"]
    },
    record: {
        type: String,
        required: true
    },

    spelling: {
        type: [
            { type: String }
        ],
        required: true
    },

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ]
});

// RecordSchema.index({ record: "text" });
// RecordSchema.index({ authors: 1, subjects: 1, languages: 1, year: -1 });
// RecordSchema.index({ language: -1 });

RecordSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})

module.exports = mongoose.model("Record", RecordSchema);