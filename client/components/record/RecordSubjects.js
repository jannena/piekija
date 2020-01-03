import React from "react";
import { setQuery } from "../../reducers/queryReducer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const MARC21 = require("../../../server/utils/marc21parser");

const ReocrdSubjects = ({ record, history, setQuery, __ }) => {
    const searchForSubject = subject => () => {
        setQuery("advanced", ["AND", [["subjects", subject, "is"]]]);
        history.push("/search");
    };

    const subjects = subject => {
        const everythingButA = subject["v"].concat(subject["x"], subject["y"], subject["z"], subject["t"], subject["n"], subject["r"]);
        return (<>
            <a href="javascript:void(0);" onClick={searchForSubject(subject["a"].join(""))}>{subject["a"].join("")}</a>
            {!!everythingButA.length && " --> " + everythingButA.join(" --> ")}
        </>);
    };

    const parsedSubjects = MARC21.getFieldsAndSubfields(record.record, ["600", "610", "611", "630", "647", "648", "650", "651", "653", "654", "655", "656", "657", "658", "662"], ["a", "v", "x", "y", "z", "t", "n", "r"])

    return (
        <>
            <tr>
                <td>{__("Subjects")}</td>
                <td>
                    {parsedSubjects.map(subject => <div key={JSON.stringify(subject)}>
                        {subjects(subject)}
                    </div>)}
                </td>
            </tr>
            {/* <div>
                Genres:
                <ul>
                    {MARC21
                        .getFieldsAndSubfields(record.record, ["655"], ["a", "v", "x", "y", "z", "t", "n", "r"])
                        .map(genre => <li key={genre["a"][0]}>
                            {subjects(genre)}
                        </li>)}
                </ul>
            </div> */}
        </>
    );
};

export default connect(
    null,
    { setQuery }
)(withRouter(ReocrdSubjects));