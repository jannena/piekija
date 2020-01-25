
const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    // juokseva numero
    ai: {
        type: Number
    },
    // MARC21: 130 / 245
    title: {
        type: String,
        required: true
    },
    alphabetizableTitle: {
        type: "String",
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

    spelling1: {
        type: [
            { type: String }
        ],
        required: true
    },
    spelling2: {
        type: [
            { type: String }
        ],
        required: true
    },

    previewText: Array,

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ]
});

RecordSchema.index({ spelling1: -1 });
RecordSchema.index({ spelling2: -1 });
RecordSchema.index({ standardCodes: 1 });
RecordSchema.index({ author: 1 });
RecordSchema.index({ authors: 1 });
RecordSchema.index({ subjects: 1 });
RecordSchema.index({ language: 1 });
RecordSchema.index({ languages: 1 });
RecordSchema.index({ year: -1 });
RecordSchema.index({ series: -1 });
RecordSchema.index({ classification: -1 });
RecordSchema.index({ country: -1 });
RecordSchema.index({ title: -1 });

RecordSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
})

module.exports = mongoose.model("Record", RecordSchema);