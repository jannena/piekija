const recordRouter = require("express").Router();
const Record = require("../models/Record");

const MARC21 = require("../utils/marc21parser");

// Get all records
recordRouter.get("/", (req, res) => {
    Record
        .find({})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.send({ error: "error" });
            console.log(err);
        });
});

// Add new record to database
// This endpoint needs marc21 data. That will be parsed to the database.
recordRouter.post("/", (req, res) => {
    const body = req.body;

    const type = body.type;
    const data = body.data;

    if (!type) return res.status(400).json({ error: "type is missing" });
    if (!data) return res.status(400).json({ error: "data is missing" });

    let parsedMARC = {};
    try {
        parsedMARC = MARC21.parse(data);
    }
    catch (e) {
        return res.status(400).json({ error: "invalid marc21 data" });
    }


    const year = parsedMARC.FIELDS["008"][0].substring(7, 11);

    const title = MARC21.getField(parsedMARC, "245", "a"); // parsedMARC.FIELDS["245"][0].subfields["a"][0];
    const language = parsedMARC.FIELDS["008"][0].substring(35, 38);
    const languages = MARC21.getSubfields(parsedMARC, "041", ["a", "b", "d", "e", "f", "g", "h", "j"])  // MARC21.getFields(parsedMARC, ["041"], "j");
    const author = MARC21.getField(parsedMARC, "100", "a"); // parsedMARC.FIELDS["100"][0].subfield["a"][0];
    const authors = MARC21.getFields(parsedMARC, ["700", "710"], "a");
    const genres = MARC21.getFields(parsedMARC, ["655"], "a"); // parsedMARC.FIELDS["655"].map(f => f.subfields["a"][0]);
    const subjects = MARC21.getFields(parsedMARC, ["650", "653"], "a"); // parsedMARC.FIELDS["650"].map(f => f.subfields["a"][0]);
    const locations = MARC21.getFields(parsedMARC, ["651"], "a"); // parsedMARC.FIELDS["651"].map(f => f.subfields["a"][0]);
    const persons = MARC21.getFields(parsedMARC, ["600"], "a"); // parsedMARC.FIELDS["600"].map(f => f.subfields["a"][0]);

    const record = {
        title,
        language,
        languages,
        author,
        authors,
        year,
        genres,
        subjects,
        locations,
        persons
    };

    res.status(201).json(record);
});

module.exports = recordRouter;