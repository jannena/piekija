import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordNotes = ({ record }) => {

    const g500 = () => <>
        {MARC21
            .getFields(record.record, ["500"], "a")
            .map(n => <tr key={n}><td>General note</td><td>{n}</td></tr>)}
    </>

    // TODO: What if subfields s, t and r are used?
    const g505 = () => <>
        {MARC21
            .getFieldsAndSubfields(record.record, ["505"], ["indicators", "a"])
            .map(n => <tr key={n["a"][0]}>
                <td>{["Contents", "Incomplete contents", "Partial contents", "", "", "", "", "", ""][n.indicators[0]] + ": "}</td>
                <td>{n["a"].join("").split("--").map(part => <div key={part}>{part}</div>)}</td>
            </tr>)}
    </>;

    const g520 = () => <>
        {MARC21
            .getFieldsAndSubfields(record.record, ["520"], ["indicators", "a", "c"])
            .map(n => <tr key={n["a"][0]}>
                <td>{["Summary", "Subject", "Review", "Scope and content", "Abstract", "Content advice"][n.indicators[0] !== " " ? n.indicators[0] + 1 : 0] + ": "}</td>
                <td>{n["a"][0] + n["c"][0]}</td>
            </tr>)}
    </>;

    return (<>
        {/* TODO: Add note titles */}
        {g500()}
        {g505()}
        {g520()}
        {MARC21
            .getFields(record.record, [
                "501", "502", "504", "506", "507", "508",
                "509", "510", "511", "513", "514", "515", "516", "518",
                "521", "522", "524", "525", "526", "530", "532", "533",
                "534", "535", "536", "538", "540", "541", "542", "544",
                "545", "546", "547", "550", "552", "555", "556", "561",
                "562", "563", "565", "567", "580", "581", "583", "584",
                "585", "586", "588"
            ], "a")
            .map((note, i) =>
                <tr key={i}>
                    <td>Other note (not named yet)</td>
                    <td>{note}</td>
                </tr>
            )}
    </>);
};

export default RecordNotes;