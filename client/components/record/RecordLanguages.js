import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordLanguages = ({ record, __ }) => {
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

    const languageTemplate = (lang, subfield, title) => !!lang[subfield].length && <tr><td>{__(title)}</td><td>
        {lang["a"].map(l => __(`lang-${l}`, l)).join(", ")}
    </td></tr>

    return (<>
        {countryOfOrigin && <tr><td>{__("Countries")}:</td> {[countryOfOrigin].concat(...countries.map(c => c.a)).map(c => __(`coun-${c}`, c)).join(", ")}</tr>}
        {mainLanguage && <tr><td>{__("Main language")}</td><td>{__(`lang-${mainLanguage}`, mainLanguage)}</td></tr>}
        {langs.map(lang => <>
            {languageTemplate(lang, "a", "Text language")}
            {languageTemplate(lang, "b", "Language of summary or abstract")}
            {languageTemplate(lang, "d", "Sung or spoken text language")}
            {languageTemplate(lang, "f", "Language of table of contents")}
            {languageTemplate(lang, "h", "Original language")}
            {languageTemplate(lang, "j", "Subtitles language")}
            {languageTemplate(lang, "k", "Intermediate translation languages")}
        </>)}
    </>);
};

export default RecordLanguages;