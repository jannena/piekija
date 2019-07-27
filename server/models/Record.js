
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
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // TODO: which MARC21 field?
    contentType: {
        type: String,
        required: true
    },

    // MARC21: 008: 07-10 / 11-14
    year: {
        type: String,
        required: true
    },

    // MARC21: 100
    author: {
        type: String,
        required: true
    },

    // MARC21: 700, ?710
    authors: {
        type: [
            { type: String }
        ],
        required: true
    },
    // head language: MARC21: 008: 35-37
    // other: MARC21: 041
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
    // MARC21: 650, ?653
    subjects: {
        type: [
            { type: String }
        ],
        required: true
    },
    // MARC21: 651
    locations: {
        type: [
            { type: String }
        ],
        required: true
    },
    // MARC21: 600, ?610
    persons: {
        type: [
            { type: String }
        ],
        required: true
    },
    // TODO: How about other 600-662 fields?

    links: {
        type: [
            {
                link: {
                    type: String,
                    required: true
                },
                title: {
                    type: String,
                    required: true
                }
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