import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordLanguages = ({ record }) => {
    const langs = MARC21.getFieldsAndSubfields(record.record, ["041"], ["a", "b", "d", "f", "g", "h", "j", "k"]);
    const countries = MARC21.getFieldsAndSubfields(record.record, ["044"], ["a"]);
    const mainLanguage = (() => {
        try {
            return record.record.FIELDS["008"][0].substring(35, 38);
        }
        catch (err) {
            return null;
        }
    })();
    const countryOfOrigin = (() => {
        try {
            return record.record.FIELDS["008"][0].substring(15, 18);
        }
        catch (err) {
            return null;
        }
    })();

    return (<>
        {countryOfOrigin && <tr><td>countries:</td> {[countryOfOrigin].concat(...countries.map(c => c.a)).join(", ")}</tr>}
        {mainLanguage && <tr><td>Main language</td><td>{mainLanguage}</td></tr>}
        {langs.map(lang => <>
            {!!lang["a"].length && <tr><td>Text language</td><td>{lang["a"].join(", ")}</td></tr>}
            {!!lang["b"].length && <tr><td>Language of summar or abstract</td><td>{lang["b"].join(", ")}</td></tr>}
            {!!lang["d"].length && <tr><td>Sung or spoken text language</td><td>{lang["d"].join(", ")}</td></tr>}
            {!!lang["f"].length && <tr><td>Language of table of contents</td><td>{lang["f"].join(", ")}</td></tr>}
            {!!lang["h"].length && <tr><td>Original language</td><td>{lang["h"].join(", ")}</td></tr>}
            {!!lang["j"].length && <tr><td>Subtitles language</td><td>{lang["j"].join(", ")}</td></tr>}
            {!!lang["k"].length && <tr><td>Intermediate translation languages</td><td>{lang["k"].join(", ")}</td></tr>}
        </>)}
    </>);
};

export default RecordLanguages;