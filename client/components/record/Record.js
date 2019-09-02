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

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

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

    return !record || record.result.id !== id
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
            <RecordClassification record={record} />
            <hr />
            <RecordStandardCodes record={record} />
            <hr />
            <RecordPublisherInfo record={record} />
            <hr />
            {MARC21
                .getFieldsAndSubfields(record.record, ["856"], ["indicators", "y", "u"])
                .map(link => <div>
                    <a href={link.u} target="_blank">{link.y}</a>
                </div>)}
            <hr />
            <RecordLanguages record={record} />
            <hr />
            <div>
                Appearance: {MARC21.getSubfields(record.record, "300", ["a", "b", "c", "e", "f", "g"]).join(" ")}
            </div>
            <div>
                Series: {MARC21.getFieldsAndSubfields(record.record, ["490"], ["a"]).map(s => <span key={s.a}>{s.a}</span>)}
            </div>
            <RecordNotes record={record} />
            <RecordAuthors record={record} />
            <RecordSubjects record={record} />


            {!isPreview && <Tabs titles={["Items |", " MARC |", " spelling"]}>
                <Tab>
                    <table>
                        <tbody>
                            {record.result.items.map((item, i) =>
                                <tr key={i}><td>{item.location.name}</td><td>{item.state}</td></tr>
                            )}
                        </tbody>
                    </table>
                </Tab>
                <Tab>
                    {/* TODO: Maybe search engine for MARC21 fields? */}
                    <MARC21Screen parsedMARC={record.record} />
                </Tab>
                <Tab>
                    {MARC21.getSpelling(record.record).map(spell => <div key={spell}>{spell}</div>)}
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