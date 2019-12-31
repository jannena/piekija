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
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const StyledTBody = styled.tbody`
    border-bottom: 1px solid black;

    &:after {
        content "";
        height: 5px;
    }
`;

const StyledImageContainer = styled.div`
    width: 100%;
    text-align: center;
    margin-right: 20px;

    @media screen and (min-width: 600px) {
        width: 200px;
    }
`;

const StyledMainInfo = styled.div`
    width: 100%;

    @media screen and (min-width: 600px) {
        width: calc(100% - 220px);
    }
`;

const Record = ({ state, record, getRecord, id, history, isPreview, __ }) => {
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
            {!isPreview && <RecordTools __={__} record={record} history={history} />}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {record.result.image && <StyledImageContainer>
                    <img style={{ maxWidth: "100%" }} src={record.result.image} />
                </StyledImageContainer>}
                <StyledMainInfo>
                    {MARC21.getFieldsAndSubfields(record.record, ["245"], ["a", "b", "c"]).slice(0, 1).map(title => <h2 key={title.a[0]}>{`${title.a[0] || ""} ${title.b[0] || ""} ${title.c[0] || ""}`}</h2>)}
                    <div>{record.result.author}</div>
                    <div>
                        {__("Content type")}: {__(record.record.LEADER.substring(6, 7), "Unknown content type")}
                    </div>
                    <RecordTime record={record} />
                </StyledMainInfo>
            </div>

            <hr />

            <table className="record-table">
                <StyledTBody>
                    <RecordAuthors __={__} record={record} />
                    <RecordSubjects __={__} record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordClassification __={__} record={record} />
                    <RecordStandardCodes __={__} record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordPublisherInfo __={__} record={record} />
                    {!!series.length && <tr><td>{__("Series")}</td> <td>{series}</td></tr>}
                    {!!appearance.length && <tr><td>{__("Appearance")}</td> <td>{appearance.join(" ")}</td></tr>}
                    <tr><td>{__("Links")}</td> <td>{MARC21
                        .getFieldsAndSubfields(record.record, ["856"], ["indicators", "y", "u", "z"])
                        .map(link => <div>
                            {console.log("Linkki", link)}
                            <a href={link.u} target="_blank">{(link.y && link.y.length > 0) ? link.y : link.z}</a>
                        </div>)}</td></tr>
                </StyledTBody>

                <StyledTBody className="record-languages-rows">
                    <RecordLanguages __={__} record={record} />
                </StyledTBody>
                <StyledTBody>
                    <RecordNotes __={__} record={record} />
                </StyledTBody>
            </table>


            {
                !isPreview && <Tabs titles={[__("Items"), __("MARC"), __("spelling")]}>
                    <Tab>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                {record.result.items.map((item, i) =>
                                    <tr key={i}>
                                        <td>{item.location.name}</td>
                                        <td style={{ backgroundColor: colorByState(item.state || "loaned"), lineHeight: "30px", textAlign: "center" }}>{__(item.state)}</td>
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
                </Tabs>
            }
        </div >
};

export default connect(
    state => ({
        record: state.record.record,
        state: state.loading.record,
        __: __(state)
    }),
    { getRecord }
)(Record);