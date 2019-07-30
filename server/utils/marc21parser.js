
const { pad, byteLength, utf8_substr } = require("./stringUtils");

const parse = marc => {
    // LEADER: first 24 characters
    const LEADER = marc.substring(0, 24);

    const h = marc.split("\u001e") // hex 1e = dec 30:  String.fromCharCode(30)

    // DIRECTORY: after LEADER until ASCII 1E
    const DIRECTORY = h[0].substring(24);

    // Start byte of data is saved in the LEADER in characters 12-16
    const startOfData = Number(LEADER.substring(12, 17));

    // console.log(fieldData, DIRECTORY.length);

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
            // console.log("vertailu", Number(a[0]), Number(b[0]));
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
            // console.log("field number", fieldNumber);
            DIRECTORY += pad(fieldNumber, 3) + pad((fieldData ? byteLength(fieldData) : byteLength(field)) + 1, 4) + pad(byteLength(FIELDS), 5);
            FIELDS += (fieldData || field) + "\u001e";
        });
    });
    return marc.LEADER + DIRECTORY + "\u001e" + FIELDS + "\u001d";
};

// Get all subfields of one field
const getSubfields = (parsedMARC, field, subfields) => {
    let ret = [];
    subfields.forEach(subfield => {
        console.log(parsedMARC.FIELDS[field][0].subfields);
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
        console.log("joo", parsedMARC.FIELDS[field][0].subfields);
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
            console.log(fieldData);
            ret = ret.concat(fieldData);
        }
        catch (e) { }
    });
    return ret;
};

// TODO Create also version that can be used with frontend
module.exports = {
    parse,
    stringify,
    getField,
    getFields,
    getSubfields
};