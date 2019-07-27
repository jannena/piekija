
// Aligns number to right
const pad = (num, length) => {
    const s = "000000000" + num;
    return s.substr(-length);
};

// https://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript
// Returns the length of a string in bytes
const byteLength = str => {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
};
// Javascript String.substring handles strings by characters
// This function handles string cutting by bytes
// https://stackoverflow.com/questions/11200451/extract-substring-by-utf-8-byte-positions
const encode_utf8 = s => {
    return unescape(encodeURIComponent(s));
};
const utf8_substr = (str, startInBytes, lengthInBytes) => {
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
};

module.exports = {
    pad,
    byteLength,
    utf8_substr
};