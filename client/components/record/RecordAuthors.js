import React from "react";
import { setQuery } from "../../reducers/queryReducer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const RecordAuthors = ({ record, history, setQuery, __ }) => {
    const authors = MARC21.getFieldsAndSubfields(record.record, ["100", "110", "700", "710"], ["a", "d", "e"]);
    if (!authors.length) return null;

    const searchForAuthor = author => () => {
        setQuery("advanced", ["AND", [["authors", author, "is"]]]);
        history.push("/search");
    };

    return (
        <tr>
            <td>{__("Authors")}</td>
            <td>
                {authors.map(author => <div key={author["a"][0]}>
                    <a href="javascript:void(0);" onClick={searchForAuthor(removeLastCharacters(author["a"][0]))}>{removeLastCharacters(author["a"][0]) + ","}</a>
                    {author["d"][0] && `, (${author["d"][0]})`} {author["e"].join(" ")}
                </div>)}
            </td>
        </tr>
    );
};

export default connect(
    null,
    { setQuery }
)(withRouter(RecordAuthors));