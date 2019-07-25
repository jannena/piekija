
const parse = marc => {
    // LEADER: first 24 characters
    const LEADER = marc.substring(0, 24);

    const h = marc.split("\u001e") // hex 1e = dec 30:  String.fromCharCode(30)

    // DIRECTORY: after LEADER until ASCII 1E
    const DIRECTORY = h[0].substring(24);

    const startOfData = Number(LEADER.substring(12, 17));

    // FIELDS: everything after directory
    const fieldData = h
        .slice(1)
        .join("\u001e");

    console.log(fieldData, DIRECTORY.length);

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

            // fields 010-> contains indicators (ie. first two characterss) and subfields
            if (["001", "002", "003", "004", "005", "006", "007", "008", "009"].indexOf(field) === -1) {
                const indicators = utf8_substr(data, 0, 2).match(/.{1,1}/g);

                const subfields = data
                    .split("\u001f")
                    .slice(1)
                    .map(sf => [sf[0], sf.substring(1)]);

                data = {
                    data: data + "\u001e",
                    subfields,
                    indicators
                };
            }

            if (FIELDS[field]) FIELDS[field].push(data);
            else FIELDS[field] = [data];
        });

    console.log(DIRECTORY
        .match(/.{1,12}/g));

    return {
        LEADER,
        FIELDS
    }
};


const stringify = marc => {
    // Convert Object to array, sort array by field numbers, convert array back to object
    marc.FIELDS = Object.entries(marc.FIELDS)
        .sort((a, b) => {
            console.log("vertailu", Number(a[0]), Number(b[0]));
            return Number(a[0]) - Number(b[0])
        });

    let DIRECTORY = "";
    let FIELDS = "";
    marc.FIELDS.forEach(([fieldNumber, fields]) => {
        fields.forEach(field => {
            console.log("field number", fieldNumber);
            DIRECTORY += fieldNumber + (field.data ? field.data.length : field.length) + FIELDS.length;
            FIELDS += field.data || field;
        });
    });
    return marc.LEADER + DIRECTORY + FIELDS;
};



// Javascript String.substring handles strings by characters
// This function handles string cutting by bytes
// https://stackoverflow.com/questions/11200451/extract-substring-by-utf-8-byte-positions
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}
function utf8_substr(str, startInBytes, lengthInBytes) {
    var resultStr = '';
    var startInChars = 0;
    for (bytePos = 0; bytePos < startInBytes; startInChars++) {

        ch = str.charCodeAt(startInChars);
        bytePos += (ch < 128) ? 1 : encode_utf8(str[startInChars]).length;
    }
    end = startInChars + lengthInBytes - 1;
    for (n = startInChars; startInChars <= end; n++) {
        ch = str.charCodeAt(n);
        end -= (ch < 128) ? 1 : encode_utf8(str[n]).length;

        resultStr += str[n];
    }
    return resultStr;
}

module.exports = {
    parse,
    stringify
};