// const fromentries = require("object.fromentries");
const flat = require("array.prototype.flat");
const logger = require("./logger");
const { pad, byteLength, utf8_substr, removeLastCharacters, removeFirstCharacters } = require("./stringUtils");
const axios = require("axios");

try {
    var iconv = require("iconv-lite");
    var crypto = require("crypto");
    var path = require("path");
    var fs = require("fs");
}
catch (err) {
    logger.log("ERROR 44849333x4");
}


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
    logger.log("parsed marcxml", parsed);

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
                logger.log();
                const code = subfield.getAttribute("code");
                const content = subfield.textContent;
                // If subfield with same code is not yet in this field, then ...
                if (data.subfields[code] === undefined) data.subfields[code] = [content];
                else data.subfields[code].push(content);
            });
            if (ready.FIELDS[el.getAttribute("tag")] === undefined) ready.FIELDS[el.getAttribute("tag")] = [data];
            else ready.FIELDS[el.getAttribute("tag")].push(data);
        }
        // logger.log(el, el.getAttribute("tag"), el.nodeName);
    });
    logger.log("parsed marc xml", ready);
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
                ret.push({ field, ...fieldData });
            });
        }
        catch (e) { }
    });
    logger.log("getFieldsAndSubfields", ret);
    return ret;
};

const contentTypes = ["a", "c", "d", "e", "f", "g", "i", "j", "k", "m", "o", "p", "r", "t"];

const languages = [
    "fin", "swe", "eng", "fre", "spa", "ita", "ger", "rus", "lat", "dan", "nor", "est",
    "por", "hun", "dut", "ice", "lav",

    "sma", "sme", "smi", "smj", "smn", "sms",
    "chi", "kor", "jpn", "hin", "ara", "tha", "heb",
    "sgn", "zxx", "mul"
];

const countries = [
    "fi ", "sw ", "xxu", "xxk", "fr ", "it ", "gw ", "ru ", "no ", "dk ", "er ",
    "po ", "hu ", "ne ", "be ", "ic ", "lv ",

    "cc ", "ja "
];

/* const contentTypes = {
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
}; */

/* const languages = {
    fin: "Finnish",
    eng: "English",
    swe: "Swedish"
}; */

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
    // logger.log("marc !!!", marc);
    const ret = [];
    marc.forEach(field => {
        subfields.forEach(subfield => {
            // logger.log(field, subfield);
            // logger.log(field[subfield].map(term => term.split(" ")));
            // logger.log("jyyyy", field[subfield]);
            try {
                // logger.log("field[subfield]", field[subfield]);
                /* const temp1 = field[subfield].map(term => term.split(" "));
                const temp = flat(temp1);
                logger.log("temp !!!", temp, "temp1 !!!", temp1);
                ret.push(temp
                    .map(removeLastCharacters)
                    .map(removeFirstCharacters)
                    .map(s => s.toLowerCase())); */
                ret.push(...flat(field[subfield]
                    .map(term => term.split(" ")))
                    .map(removeLastCharacters)
                    .map(removeFirstCharacters)
                    .map(s => s.toLowerCase()));
            }
            catch (err) {
                // logger.log("error while making spelling", err);
            }
        });
    });
    // logger.log("ret !!!", ret);
    return ret;
};

/*
 * Spelling 1: otsikko (osissa), tekijät (osissa)
 * Spelling 2: asiasanat ja ala-asiasanat, standardikoodit, luokitus
 * Spelling 3: julkaisija, huomautukset, sarja
*/
const getSpelling = parsedMARC => {
    // logger.log("parsedMARC !!!", parsedMARC);
    const spelling1 = [...new Set([].concat(
        // title
        getFieldSpelling(
            parsedMARC,
            ["245", "246"],
            ["a", "b", "c", "d", "p", "n", "x", "y", "z"]
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
        // Specific contents
        getFieldSpelling(parsedMARC, ["979"], ["b", "c", "d", "e"]),
        // additional 1 (field 991)
        getFieldSpelling(parsedMARC, ["991"], ["a"])
    ))];
    const spelling2 = [...new Set([].concat(
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
            ["a", "g", "r", "s", "t"]
        ),
        // abstractEtc
        getFieldSpelling(
            parsedMARC,
            ["520"],
            ["a", "b"]
        ),
        // notes
        getFieldSpelling(
            parsedMARC,
            [
                "500", "501", "502", "504", "506", "507", "508",
                "509", "510", "511", "513", "514", "515", "516", "518",
                "521", "522", "524", "525", "526", "530", "532", "533",
                "534", "535", "536", "538", "540", "541", "542", "544",
                "545", "546", "547", "550", "552", "555", "556", "561",
                "562", "563", "565", "567", "580", "581", "583", "584",
                "585", "586", "588"
            ],
            ["a"]
        ),
        // additional 2 (field 992)
        getFieldSpelling(parsedMARC, ["992"], ["a"])
    ))];
    return { spelling1, spelling2 };
};

const parseMARCToDatabse = async (parsedMARC, data) => {
    const year = (() => {
        try {
            const y = Number(parsedMARC.FIELDS["008"][0].substring(7, 11));
            return isNaN(y) ? -10000 : y;
        }
        catch (err) {
            return -10000;
        }
    })();
    const contentType = parsedMARC.LEADER.substring(6, 7);

    const nonFilingCharactersFromField = getFieldsAndSubfields(parsedMARC, ["245"], ["indicators"]);
    const nonFiling = (nonFilingCharactersFromField.length > 0 && Number(nonFilingCharactersFromField[0].indicators[1])) || 0;
    // Remove last non-letter characters
    title = removeLastCharacters(getField(parsedMARC, "245", "a") + " " + removeLastCharacters(getField(parsedMARC, "245", "n")));
    const alphabetizableTitle = title.substring(nonFiling).toLowerCase();
    logger.log("non filing characters", nonFilingCharactersFromField, nonFiling);

    const language = parsedMARC.FIELDS["008"][0].substring(35, 38);
    const languagesDuplicates = getSubfields(parsedMARC, "041", ["a", "b", "d", "e", "f", "g", "h", "j"]);  // MARC21.getFields(parsedMARC, ["041"], "j");
    languagesDuplicates.unshift(language);
    const extractedLanguages = [];
    languagesDuplicates.forEach(lang => extractedLanguages.push(...lang.match(/.{1,3}/g)));
    // Remove duplicates in languages
    const languages = [...new Set(extractedLanguages)];

    // TODO: Currently this splits the series to words...
    const series = [...new Set(getFieldSpelling(
        parsedMARC,
        ["490", "830"],
        ["a"]
    ))].map(removeLastCharacters);
    const country = parsedMARC.FIELDS["008"][0].substring(15, 18) || "";
    const standardCodes = [...new Set(getFieldSpelling(
        parsedMARC,
        ["020", "022", "024"],
        ["a"]
    ))];

    // TODO: udk 894.541-3(024.7)
    const classification = [...new Set(getFieldSpelling(
        parsedMARC,
        ["050", "080", "082", "084"],
        ["a"]
    ))];

    // ?? const appearance = ;??

    const authorWithLastCharacters = getField(parsedMARC, "100", "a") || getField(parsedMARC, "110", "a"); // parsedMARC.FIELDS["100"][0].subfield["a"][0];
    const author = removeLastCharacters(authorWithLastCharacters);
    const authorsDuplicates = getFields(parsedMARC, ["700", "710"], "a");
    authorsDuplicates.unshift(author);
    // Remove duplicates in authors
    let authors = [...new Set(authorsDuplicates)];
    // Remove last non-letter characters
    authors = authors.map(removeLastCharacters);

    const subjectsWithLastCharacters = getFields(parsedMARC, ["600", "650", "651", "653", "655", "610", "611", "630", "647", "648", "654", "656", "657", "658", "662"], "a"); // parsedMARC.FIELDS["650"].map(f => f.subfields["a"][0]);
    const subjects = subjectsWithLastCharacters.map(removeLastCharacters);

    const previewTexts = getFieldsAndSubfields(parsedMARC, ["990"], ["a", "u", "y"]);
    let previewText = [];
    logger.log("----------Try to find previewText", previewTexts);
    previewTexts.forEach(pr => {
        logger.log("Tässä on preview", pr);
        if (pr["a"] && pr["u"] && pr["y"]) return previewText.push([pr["a"][0], pr["u"][0], pr["y"][0]]);
        else if (pr["a"]) return previewText = [...previewText, ...pr["a"]];
    });

    const image = getFieldsAndSubfields(parsedMARC, ["856"], ["indicators", "y", "u", "z", "q"])
        .filter(link => link["q"].some(q => q.match(/image\//)))[0];
    logger.log("trying to get image", image);
    let imageAddress = (image && image["u"] && image["u"][0]) || "";

    try {
        if (imageAddress) {
            const imageLocalAddress = crypto.createHash("md5").update(imageAddress).digest("hex") + "." + (image["q"][0].split("/")[1] || ".jpg");

            const response = await axios.get(imageAddress, { responseType: "stream" });
            const file = fs.createWriteStream(path.resolve(__dirname, "..", "build", "covers", imageLocalAddress));

            response.data.pipe(file);

            imageAddress = "/covers/" + imageLocalAddress;
        }
    }
    catch (err) {
        logger.log(err);
    }


    const description = getFieldsAndSubfields(parsedMARC, ["856"], ["indicators", "y", "u", "z", "q"])
        .filter(link => link["q"].some(q => q.match(/text\//)))[0];
    logger.log("trying to get description", description);
    const descriptionAddress = (description && description["u"] && description["u"][0]) || "";

    let descriptionText = "";
    try {
        if (descriptionAddress) {
            const response = (await axios.get(descriptionAddress, { responseType: "arraybuffer" }));
            logger.log(response.headers, response.headers["Content-Type"])
            descriptionText = iconv.decode(Buffer.from(response.data, "latin1"), "latin1");
        }
    }
    catch (err) {
        logger.log(err);
    }


    // Remove marc fields 9xx and 8xx expect 856
    // logger.log(fromentries(Object.entries(parsedMARC.FIELDS)));
    // data = stringify({
    //     LEADER: parsedMARC.LEADER,
    //     FIELDS: fromentries(Object.entries(parsedMARC.FIELDS).filter(([field]) => (Number(field) < 800 || Number(field) === 856)))
    // });

    const { spelling1, spelling2 } = getSpelling(parsedMARC);

    // logger.log(spelling1, spelling2);

    return {
        timeAdded: new Date(),
        timeModified: new Date(),
        image: imageAddress,
        description: descriptionText,
        contentType,

        alphabetizableTitle,

        title,
        country,
        language,
        languages,
        author,
        authors,
        year,
        subjects,

        classification,
        standardCodes,
        series,
        // appearance, ?

        recordType: "marc21",
        record: data,

        spelling1,
        spelling2,

        previewText
    };
};

module.exports = {
    parse,
    stringify,
    getField,
    getFields,
    getSubfields,
    tryParse,
    getFieldsAndSubfields,

    contentTypes,
    countries,
    languages,

    parseMARCToDatabse,
    getSpelling,
    MARCXMLToMARC // This can be used only in frontend
};

// const moikkeliskoo = parse("00197ccm a2200085La 4500008004100000100001600041245003600057700000800093700001000101860327s1985 fi a 000 0 fin d1 aJoku ihmeee aKissoja ja koiria :bkaikkialla aasd ayytyy");
// logger.log(moikkeliskoo);