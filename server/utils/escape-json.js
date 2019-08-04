
module.exports = jsonstring => jsonstring
    .split("")
    .map(char => char.charCodeAt(0) <= 31
        ? `\\u00${char.charCodeAt(0).toString(16)}`
        : char
    )
    .join("");