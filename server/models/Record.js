
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
    description: {
        type: String
    },
    image: {
        type: String
    },
    // TODO: which MARC21 field?
    contentType: {
        type: String,
        required: true
    },

    // MARC21: 008: 07-10 / 11-14
    year: {
        type: Number,
        required: true
    },

    // MARC21: 100
    author: {
        type: String
    },

    // MARC21: 700, ?710
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

    links: {
        type: [
            {
                link: { type: String },
                title: { type: String }
            }
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
    }
});

module.exports = mongoose.model("Record", RecordSchema);