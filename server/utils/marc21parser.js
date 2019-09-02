const fromentries = require("object.fromentries");
const logger = require("./logger");
const { pad, byteLength, utf8_substr, removeLastCharacters, removeFirstCharacters } = require("./stringUtils");


const parse = marc => {
    // LEADER: first 24 characters
    const LEADER = marc.substring(0, 24);

    const h = marc.split("\u001e") // hex 1e = dec 30:  String.fromCharCode(30)

    // DIRECTORY: after LEADER until ASCII 1E
    const DIRECTORY = h[0].substring(24);

    // Start byte of data is saved in the LEADER in characters 12-16
    const startOfData = Number(LEADER.substring(12, 17));

    // logger.log(fieldData, DIRECTORY.length);

    let FIELDS = {};

    // Directory has 12 characters long information of every field
    // 3 chars: field number
    // 4 chars: length of a field
    // 5 chars: starting point of a field
    DIRECTORY
        .match(/.{1,12}/g)
        .forEach(dir => {
            const field = dir.substring(0, 3);
            const length = Number(dir.substring(3, 7));
            const start = Number(dir.substring(7, 12));

            let data = utf8_substr(marc, startOfData + start, length - 1);

            // fields 010-> contains indicators (ie. first two characters) and subfields
            if (["001", "002", "003", "004", "005", "006", "007", "008", "009"].indexOf(field) === -1) {
                const indicators = utf8_substr(data, 0, 2).match(/.{1,1}/g);

                const subfields = {};

                data
                    .split("\u001f") /* Separates field by subfield separator \u001f */
                    .slice(1)
                    .map(sf => [sf[0], sf.substring(1)]) /* First character is the subfield code, everything after that is data */
                    .forEach(([field, content]) => {
                        if (subfields[field]) subfields[field].push(content);
                        else subfields[field] = [content];
                    });

                data = {
                    subfields,
                    indicators
                };
            }

            if (FIELDS[field]) FIELDS[field].push(data);
            else FIELDS[field] = [data];
        });


    return {
        LEADER,
        FIELDS
    }
};


// TODO: Fix stringification of LEADER. There must be correct record length and starting point of the record in LEADER.
const stringify = marc => {
    // Convert Object to array, sort array by field numbers, convert array back to object
    marc.FIELDS = Object.entries(marc.FIELDS)
        .sort((a, b) => {
            // logger.log("vertailu", Number(a[0]), Number(b[0]));
            return Number(a[0]) - Number(b[0])
        });

    let DIRECTORY = "";
    let FIELDS = "";
    // Go through every field type (= field number)
    marc.FIELDS.forEach(([fieldNumber, fields]) => {
        // Go through every field of current field type (= field number)
        fields.forEach(field => {
            let fieldData = "";
            // Only fields 010-> have indicators and subfields
            if (["001", "002", "003", "004", "005", "006", "007", "008", "009"].indexOf(fieldNumber) === -1) {
                // Add indicators before subfields
                fieldData = field.indicators.join("");
                // Convert subfields to marc21
                Object.entries(field.subfields).forEach(([subfieldCode, subfields]) => {
                    const mappedSubfields = subfields.map(sf => `\u001f${subfieldCode}${sf}`);
                    fieldData += mappedSubfields.join("");
                });
            }
            // logger.log("field number", fieldNumber);
            DIRECTORY += pad(fieldNumber, 3) + pad((fieldData ? byteLength(fieldData) : byteLength(field)) + 1, 4) + pad(byteLength(FIELDS), 5);
            FIELDS += (fieldData || field) + "\u001e";
        });
    });

    let fullrecord = marc.LEADER + DIRECTORY + "\u001e" + FIELDS + "\u001d";

    // First 5 characters of LEADER is the length of the record
    // Characters 12 - 16: length of LEADER and DIRECTORY and directory end character
    fullrecord = pad(byteLength(fullrecord), 5) + fullrecord.substring(5, 12) + pad(DIRECTORY.length + 24 + 1, 5) + fullrecord.substring(17);

    return fullrecord;
};

const MARCXMLToMARC = marcxml => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(marcxml, "application/xml");
    console.log("parsed marcxml", parsed);

    const ready = {
        LEADER: "",
        FIELDS: {}
    };

    Array.prototype.slice.call(parsed.documentElement.children[0].children).forEach(el => {
        if (el.nodeName === "leader") {
            ready.LEADER = el.textContent;
        }
        else if (el.nodeName === "controlfield") {
            ready.FIELDS[el.getAttribute("tag")] = [el.textContent];
        }
        else if (el.nodeName === "datafield") {
            const data = {
                indicators: [el.getAttribute("ind1"), el.getAttribute("ind2")],
                subfields: {}
            };
            // Go through subfields of the field
            Array.prototype.slice.call(el.children).forEach(subfield => {
                console.log();
                const code = subfield.getAttribute("code");
                const content = subfield.textContent;
                // If subfield with same code is not yet in this field, then ...
                if (data.subfields[code] === undefined) data.subfields[code] = [content];
                else data.subfields[code].push(content);
            });
            if (ready.FIELDS[el.getAttribute("tag")] === undefined) ready.FIELDS[el.getAttribute("tag")] = [data];
            else ready.FIELDS[el.getAttribute("tag")].push(data);
        }
        // console.log(el, el.getAttribute("tag"), el.nodeName);
    });
    console.log("parsed marc xml", ready);
    return ready;
};

// Get all subfields of one field
const getSubfields = (parsedMARC, field, subfields) => {
    let ret = [];
    subfields.forEach(subfield => {
        try {
            ret = ret.concat(parsedMARC.FIELDS[field][0].subfields[subfield] || []);
        }
        catch (e) {
            return [];
        }
    });
    return ret;
};
// Get one subfield of one field
const getField = (parsedMARC, field, subfield) => {
    try {
        logger.log("joo", parsedMARC.FIELDS[field][0].subfields);
        return parsedMARC.FIELDS[field][0].subfields[subfield][0];
    }
    catch (e) {
        return "";
    }
};
// Get one subfield from every fields given
const getFields = (parsedMARC, fields, subfield) => {
    let ret = [];
    fields.forEach(field => {
        try {
            const fieldData = parsedMARC.FIELDS[field].map(f => f.subfields[subfield][0])
            logger.log(fieldData);
            ret = ret.concat(fieldData);
        }
        catch (e) { }
    });
    return ret;
};
// Get all fields and all subfields
const getFieldsAndSubfields = (parsedMARC, fields, subfields) => {
    let ret = [];
    fields.forEach((field, i) => {
        try {
            if (parsedMARC.FIELDS[field] === undefined) return;
            parsedMARC.FIELDS[field].forEach(f => {
                const fieldData = {};
                subfields.forEach(subfield => {
                    if (subfield === "indicators") fieldData.indicators = f.indicators;
                    else if (f.subfields[subfield]) fieldData[subfield] = f.subfields[subfield];
                    else fieldData[subfield] = [];
                });
                ret.push(fieldData);
            });
        }
        catch (e) { }
    });
    logger.log("getFieldsAndSubfields", ret);
    return ret;
};

const contentTypes = {
    a: "Language material",
    c: "Notated music",
    d: "Manuscript notated music",
    e: "Cartographic material",
    f: "Manuscript cartographic material",
    g: "Projected medium",
    i: "Nonmusical sound recording",
    j: "Musical sound recording",
    k: "Two-dimensional nonprojectable graphic",
    m: "Computer file",
    o: "Kit",
    p: "Mixed materials",
    r: "Three-dimensional artifact or naturally occurring object",
    t: "Manuscript language material"
};

const languages = {
    fin: "Finnish",
    eng: "English",
    swe: "Swedish"
};

const tryParse = marc => {
    try {
        const parsedMARC = parse(marc);
        return parsedMARC;
    }
    catch (e) {
        logger.log(e);
        return null;
    }
};

const getFieldSpelling = (parsedMARC, fields, subfields) => {
    const marc = getFieldsAndSubfields(parsedMARC, fields, subfields);
    const ret = [];
    marc.forEach(field => {
        subfields.forEach(subfield => {
            console.log(field, subfield);
            ret.push(...field[subfield]
                .map(term => term.split(" "))
                .flat()
                .map(removeLastCharacters)
                .map(removeFirstCharacters));
        });
    });
    return ret;
};

const getSpelling = parsedMARC => {
    /* const title = getFieldsAndSubfields(parsedMARC, ["245", "246"], ["a", "b", "c"]);
    const subjects = getFieldsAndSubfields(
        parsedMARC,
        ["600", "610", "611", "630", "647", "648", "650", "651", "653", "654", "655", "656", "657", "658", "662"],
        ["a", "b", "c", "d", "x", "y", "z"]
    );
    const authors = getFieldsAndSubfields(
        parsedMARC,
        ["100", "110", "700", "710"],
        ["a", "b", "c"]
    );
    const publishersEtc = getFieldsAndSubfields(
        parsedMARC,
        ["260"],
        ["a", "b", "c", "e", "f", "g"]
    );
    const contents = getFieldsAndSubfields(
        parsedMARC,
        ["505"],
        ["a", "g"]
    );
    const abstractEtc = getFieldsAndSubfields(
        parsedMARC,
        ["520"],
        ["a", "b"]
    );
    const series = getFieldsAndSubfields(
        parsedMARC,
        ["490", "830"],
        ["a"]
    );
    const standardCodes = getFieldsAndSubfields(
        parsedMARC,
        ["020", "022", "024"],
        ["a"]
    );
    const classification = getFieldsAndSubfields(
        parsedMARC,
        ["050", "080", "082", "084"],
        ["a"]
    ); */

    const spelling = [...new Set([].concat(
        // title
        getFieldSpelling(
            parsedMARC,
            ["600", "610", "611", "630", "647", "648", "650", "651", "653", "654", "655", "656", "657", "658", "662"],
            ["a", "b", "c", "d", "x", "y", "z"]
        ),
        // subjects
        getFieldSpelling(
            parsedMARC,
            ["600", "610", "611", "630", "647", "648", "650", "651", "653", "654", "655", "656", "657", "658", "662"],
            ["a", "b", "c", "d", "x", "y", "z"]
        ),
        // authors
        getFieldSpelling(
            parsedMARC,
            ["100", "110", "700", "710"],
            ["a", "b", "c"]
        ),
        // publishersEtc
        getFieldSpelling(
            parsedMARC,
            ["260", "264"],
            ["a", "b", "c", "e", "f", "g"]
        ),
        // contents
        getFieldSpelling(
            parsedMARC,
            ["505"],
            ["a", "g"]
        ),
        // abstractEtc
        getFieldSpelling(
            parsedMARC,
            ["520"],
            ["a", "b"]
        ),
        // series
        getFieldSpelling(
            parsedMARC,
            ["490", "830"],
            ["a"]
        ),
        // standardCodes
        getFieldSpelling(
            parsedMARC,
            ["020", "022", "024"],
            ["a"]
        ),
        // classification
        getFieldSpelling(
            parsedMARC,
            ["050", "080", "082", "084"],
            ["a"]
        ),
    ))].filter(value => value.length > 3)
    return spelling;
};

const parseMARCToDatabse = (parsedMARC, data) => {
    // TODO: ohitusindikaattorit

    // TODO: There are catalouging rules.
    const year = Number(parsedMARC.FIELDS["008"][0].substring(7, 11)) || -10000;
    const contentType = parsedMARC.LEADER.substring(6, 7);

    let title = getField(parsedMARC, "245", "a"); // parsedMARC.FIELDS["245"][0].subfields["a"][0];
    // Remove last non-letter characters
    title = removeLastCharacters(title);

    const language = parsedMARC.FIELDS["008"][0].substring(35, 38);
    const languagesDuplicates = getSubfields(parsedMARC, "041", ["a", "b", "d", "e", "f", "g", "h", "j"]);  // MARC21.getFields(parsedMARC, ["041"], "j");
    languagesDuplicates.unshift(language);
    // Remove duplicates in languages
    const languages = [...new Set(languagesDuplicates)];

    const authorWithLastCharacters = getField(parsedMARC, "100", "a") || getField(parsedMARC, "110", "a"); // parsedMARC.FIELDS["100"][0].subfield["a"][0];
    const author = removeLastCharacters(authorWithLastCharacters);
    const authorsDuplicates = getFields(parsedMARC, ["700", "710"], "a");
    authorsDuplicates.unshift(author);
    // Remove duplicates in authors
    let authors = [...new Set(authorsDuplicates)];
    // Remove last non-letter characters
    authors = authors.map(removeLastCharacters);

    const genres = getFields(parsedMARC, ["655"], "a"); // parsedMARC.FIELDS["655"].map(f => f.subfields["a"][0]);
    const subjectsWithLastCharacters = getFields(parsedMARC, ["600", "650", "651", "653", "610", "611", "630", "647", "648", "654", "656", "657", "658", "662"], "a"); // parsedMARC.FIELDS["650"].map(f => f.subfields["a"][0]);
    const subjects = subjectsWithLastCharacters.map(removeLastCharacters);

    // TODO: Fix links (there are another ways to store links, too)
    const linkURLs = getFields(parsedMARC, ["856"], "u");
    const linkTexts = getFields(parsedMARC, ["856"], "y");
    const links = linkURLs.map((link, i) => [link, linkTexts[i] || ""]);

    // Remove marc fields 9xx and 8xx expect 856
    // logger.log(fromentries(Object.entries(parsedMARC.FIELDS)));
    // data = stringify({
    //     LEADER: parsedMARC.LEADER,
    //     FIELDS: fromentries(Object.entries(parsedMARC.FIELDS).filter(([field]) => (Number(field) < 800 || Number(field) === 856)))
    // });

    return {
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
};

// TODO Create also version that can be used with frontend
module.exports = {
    parse,
    stringify,
    getField,
    getFields,
    getSubfields,
    tryParse,
    getFieldsAndSubfields,
    contentTypes,
    parseMARCToDatabse,
    getSpelling,
    MARCXMLToMARC // This can be used only in frontend
};