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

// Get one record
recordRouter.get("/:id", (req, res) => {
    const id = req.params.id;

    Record
        .findById(id)
        .then(result => {
            if (result) res.json(result);
            else res.status(404).end();
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
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


    // TODO: ohitusindikaattorit

    // TODO: There are catalouging rules.
    const year = Number(parsedMARC.FIELDS["008"][0].substring(7, 11));
    const contentType = parsedMARC.LEADER.substring(6, 7);

    const title = MARC21.getField(parsedMARC, "245", "a"); // parsedMARC.FIELDS["245"][0].subfields["a"][0];
    
    const language = parsedMARC.FIELDS["008"][0].substring(35, 38);
    const languagesDuplicates = MARC21.getSubfields(parsedMARC, "041", ["a", "b", "d", "e", "f", "g", "h", "j"]);  // MARC21.getFields(parsedMARC, ["041"], "j");
    languagesDuplicates.unshift(language);
    // Remove duplicates in languages
    const languages = [...new Set(languagesDuplicates)];

    const author = MARC21.getField(parsedMARC, "100", "a"); // parsedMARC.FIELDS["100"][0].subfield["a"][0];
    const authorsDuplicates = MARC21.getFields(parsedMARC, ["700", "710"], "a");
    authorsDuplicates.unshift(author);
    // Remove duplicates in authors
    const authors = [...new Set(authorsDuplicates)];

    const genres = MARC21.getFields(parsedMARC, ["655"], "a"); // parsedMARC.FIELDS["655"].map(f => f.subfields["a"][0]);
    const subjects = MARC21.getFields(parsedMARC, ["650", "651", "600", "653"], "a"); // parsedMARC.FIELDS["650"].map(f => f.subfields["a"][0]);

    // TODO: Fix links (there are another ways to store links, too)
    const linkURLs = MARC21.getFields(parsedMARC, ["856"], "u");
    const linkTexts = MARC21.getFields(parsedMARC, ["856"], "y");
    const links = linkURLs.map((link, i) => [link, linkTexts[i] || ""]);

    const record = {
        timeAdded: new Date(),
        timeModified: new Date(),
        image: "",
        description: "",
        contentType,
        
        title,
        language,
        languages,
        author,
        authors,
        year,
        genres,
        subjects,
        links,

        recordType: "marc21",
        record: data
    };

    const newRecord = new Record(record);

    newRecord
        .save()
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
            console.log(err);
        });
});

module.exports = recordRouter;