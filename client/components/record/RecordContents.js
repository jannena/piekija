import React from "react";
import { connect } from "react-redux";
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordContents = ({ record, __ }) => {
    const g505 = MARC21
        .getFieldsAndSubfields(record.record, ["505"], ["indicators", "a"])
        .map(n => <div key={n["a"][0]}>
            <div><strong>{__(["Contents", "Incomplete contents", "Partial contents", "", "", "", "", "", ""][n.indicators[0]]) + ": "}</strong></div>
            <div>{n["a"].join("").split("--").map(part => <div key={part}>{part}</div>)}</div>
        </div>);

    const g979 = MARC21
        .getFieldsAndSubfields(record.record, ["979"], ["b", "c", "d", "e", "f", "g", "h", "i", "j"])
        .map((n, i) => <tr key={i}>
            <td>{n["b"][0]}</td>
            <td>{[...n["c"], ...n["d"]].join("; ")}</td>
            <td>{[...n["h"], ...n["i"], ...n["j"]].map(l => __(`lang-${l}`, l)).join(", ")}</td>
        </tr>);

    if (g979.length > 0) return <table style={{ width: "100%" }}>
        <thead>
            <tr>
                <th>{__("Title")}</th>
                <th>{__("Author")}</th>
                <th>{__("Language")}</th>
            </tr>
        </thead>
        <tbody>
            {g979}
        </tbody>
    </table>;

    if (g505.length > 0) return g505;

    return null;
};

export default connect(
    state => ({
        __: __(state)
    })
)(RecordContents);