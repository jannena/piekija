import React, { useEffect } from "react";
import { Tabs, Tab } from "../Tabs";
import MARC21Screen from "./MARC21Screen";
import RecordLanguages from "./RecordLanguages";
import RecordNotes from "./RecordNotes";
import RecordTime from "./RecordTime";
import RecordClassification from "./RecordClassification";
import RecordStandardCodes from "./RecordStandardCodes";
import RecordSubjects from "./RecordSubjects";
import RecordTools from "./RecordTools";
import { connect } from "react-redux";
import { getRecord } from "../../reducers/recordReducer";
import Loader from "../Loader";
import RecordPublisherInfo from "./RecordPublisherInfo";
import RecordAuthors from "./RecordAuthors";
import styled from "styled-components";
import "../../css/record.css";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const StyledTBody = styled.tbody`
    border-bottom: 1px solid black;

    &:after {
        content "";
        height: 5px;
    }
`;

const Record = ({ state, record, getRecord, id, history, isPreview }) => {
    console.log(id);
    console.log("record", record);

    useEffect(() => {
        console.log(id);
        if (!isPreview) getRecord(id);
    }, [id]);

    if (state.state === 0) return null;
    if (state.state === 1) return <Loader />
    if (state.state === 3) return <p>Error: {state.error}</p>;

    const appearance = MARC21.getSubfields(record.record, "300", ["a", "b", "c", "e", "f", "g"]);
    const series = MARC21.getFieldsAndSubfields(record.record, ["490"], ["a"]).map(s => <div key={s.a}>{s.a}</div>);

    const spelling = MARC21.getSpelling(record.record);

    const colorByState = state => {
        if (state === "not loaned") return "#00d400";
        else if (state === "not in use") return "white";
        else return "#ff3c3c";
    };

    return !record || !record.result || record.result.id !== id
        ? null
        : <div>
            {!isPreview && <>
                <button onClick={history.goBack}>&lt; Back</button>
                <RecordTools record={record} history={history} />
            </>}
            {MARC21.getFieldsAndSubfields(record.record, ["245"], ["a", "b", "c"]).slice(0, 1).map(title => <h2 key={title.a[0]}>{`${title.a[0] || ""} ${title.b[0] || ""} ${title.c[0] || ""}`}</h2>)}
            <div>
                Content type: {MARC21.contentTypes[record.record.LEADER.substring(6, 7)]}
            </div>
            <RecordTime record={record} />

            <table className="record-table">
                <StyledTBody>
                    <RecordAuthors record={record} />
                    <RecordSubjects record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordClassification record={record} />
                    <RecordStandardCodes record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordPublisherInfo record={record} />
                    {!!series.length && <tr><td>Series</td> <td>{series}</td></tr>}
                    {!!appearance.length && <tr><td>Appearance</td> <td>{appearance.join(" ")}</td></tr>}
                    <tr><td>Links</td> <td>{MARC21
                        .getFieldsAndSubfields(record.record, ["856"], ["indicators", "y", "u"])
                        .map(link => <div>
                            <a href={link.u} target="_blank">{link.y}</a>
                        </div>)}</td></tr>
                </StyledTBody>

                <StyledTBody className="record-languages-rows">
                    <RecordLanguages record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordNotes record={record} />

                    {/* TODO: Add notes <RecordNotes record={record} /> */}
                </StyledTBody>
            </table>


            {!isPreview && <Tabs titles={["Items", "MARC", "spelling"]}>
                <Tab>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            {record.result.items.map((item, i) =>
                                <tr key={i}>
                                    <td>{item.location.name}</td>
                                    <td style={{ backgroundColor: colorByState(item.state || "loaned"), lineHeight: "30px", textAlign: "center" }}>{item.state}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Tab>
                <Tab>
                    {/* TODO: Maybe search engine for MARC21 fields? */}
                    <MARC21Screen parsedMARC={record.record} />
                </Tab>
                <Tab>
                    <div>Spelling1: {spelling.spelling1.join(", ")}</div>
                    <div>Spelling2: {spelling.spelling2.join(", ")}</div>
                </Tab>
            </Tabs>}
        </div>
};

export default connect(
    state => ({
        record: state.record.record,
        state: state.loading.record
    }),
    { getRecord }
)(Record);