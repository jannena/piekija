import React from "react";
import { Link } from "react-router-dom";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const RecordAuthors = ({ record }) => {
    const authors = MARC21.getFieldsAndSubfields(record.record, ["100", "110", "700", "710"], ["a", "d", "e"]);
    if (!authors.length) return null;
    return (
        <tr>
            <td>Authors</td>
            <td>
                {authors.map(author => <div key={author["a"][0]}>
                    <Link to={`/search?type=simple&q=${encodeURIComponent(removeLastCharacters(author["a"][0]))}`}>{removeLastCharacters(author["a"][0]) + ","}</Link>
                    {author["d"][0] && `, (${author["d"][0]})`} {author["e"].join(" ")}
                </div>)}
            </td>
        </tr>
    );
};

export default RecordAuthors;