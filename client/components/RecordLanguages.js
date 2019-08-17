import React from "react";

const MARC21 = require("../../server/utils/marc21parser");

const RecordLanguages = ({ record }) => {
    const langs = MARC21.getFieldsAndSubfields(record.record, ["041"], ["a", "b", "d", "f", "g", "h", "j", "k"]);
    const mainLanguage = (() => {
        try {
            return record.record.FIELDS["008"][0].substring(35, 38);
        }
        catch (err) {
            return false;
        }
    })();

    return (<>
        {mainLanguage && <div>Main language: {mainLanguage}</div>}
        {langs.map(lang => <>
            <div>{!!lang["a"].length && "Text: " + lang["a"].join(", ")}</div>
            <div>{!!lang["b"].length && "Summar or abstract: " + lang["b"].join(", ")}</div>
            <div>{!!lang["d"].length && "Sung or spoken text: " + lang["d"].join(", ")}</div>
            <div>{!!lang["f"].length && "Table of contents: " + lang["f"].join(", ")}</div>
            <div>{!!lang["h"].length && "Original: " + lang["h"].join(", ")}</div>
            <div>{!!lang["j"].length && "Subtitles: " + lang["j"].join(", ")}</div>
            <div>{!!lang["k"].length && "Intermediate translations: " + lang["k"].join(", ")}</div>
        </>)}
    </>);
};

export default RecordLanguages;