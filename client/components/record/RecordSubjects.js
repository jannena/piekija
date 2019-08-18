import React from "react";
import { Link } from "react-router-dom";

const MARC21 = require("../../../server/utils/marc21parser");

const ReocrdSubjects = ({ record }) => {
    const subjects = subject => {
        const everythingButA = subject["v"].concat(subject["x"], subject["y"], subject["z"], subject["t"], subject["n"], subject["r"]);
        return (<>
            <Link to={`/search?type=simple&q=${subject["a"].join("")}`}>{subject["a"].join("")}</Link>
            {!!everythingButA.length && " --> " + everythingButA.join(" --> ")}
        </>);
    };

    return (
        <>
            <div>
                Subjects:
                <ul>
                    {MARC21
                        .getFieldsAndSubfields(record.record, ["600", "650", "651", "653"], ["a", "v", "x", "y", "z", "t", "n", "r"])
                        .map(subject => <li key={JSON.stringify(subject)}>
                            {subjects(subject)}
                        </li>)}
                </ul>
            </div>
            <div>
                Genres:
                <ul>
                    {MARC21
                        .getFieldsAndSubfields(record.record, ["655"], ["a", "v", "x", "y", "z", "t", "n", "r"])
                        .map(genre => <li key={genre["a"][0]}>
                            {subjects(genre)}
                        </li>)}
                </ul>
            </div></>
    );
};

export default ReocrdSubjects;