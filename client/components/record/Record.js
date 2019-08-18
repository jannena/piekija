import React, { useState, useEffect } from "react";
import recordService from "../../services/recordService";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "../Tabs";
import MARC21Screen from "./MARC21Screen";
import RecordLanguages from "./RecordLanguages";
import RecordNotes from "./RecordNotes";
import RecordTime from "./RecordTime";
import RecordClassification from "./RecordClassification";
import RecordStandardCodes from "./RecordStandardCodes";
import ReocrdSubjects from "./RecordSubjects";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const Record = ({ id, history: { goBack } }) => {
    const [record, setRecord] = useState(null);

    console.log(id);
    console.log("record", record);

    useEffect(() => {
        recordService
            .get(id)
            .then(result => {
                console.log(result.record, MARC21.parse(result.record));
                setRecord({
                    result,
                    record: MARC21.parse(result.record)
                });
                console.log("received record", result, record);
            })
            .catch(err => {
                console.log(JSON.parse(JSON.stringify(err)), err.message);
            });
    }, [id]);

    

    return !record
        ? <p>Loading...</p>
        : <div>
            <button onClick={goBack}>&lt; Back</button>
            {MARC21.getFieldsAndSubfields(record.record, ["245"], ["a", "b", "c"]).slice(0, 1).map(title => <h2 key={title.a[0]}>{`${title.a[0] || ""} ${title.b[0] || ""} ${title.c[0] || ""}`}</h2>)}
            <div>
                Content type: {MARC21.contentTypes[record.record.LEADER.substring(6, 7)]}
            </div>
            <RecordTime record={record} />
            <RecordClassification record={record} />
            <hr />
            <RecordStandardCodes record={record} />
            <hr />
            <div>
                {MARC21
                    .getFieldsAndSubfields(record.record, ["264"], ["indicators", "a", "b", "c"])
                    .map((field, i) =>
                        <div key={field.indicators[1]}>
                            {["Production", "Publication", "Distribution", "Manufacture", "Copyright notice date"][Number(field.indicators[1])]}: {field.a} {field.b} {field.c}
                        </div>
                    )}
                {MARC21
                    .getFieldsAndSubfields(record.record, ["260"], ["a", "b", "c", "e", "f"])
                    .map(c => <div key={c.a}>
                        {"Publisher / ..."} {c.a} {c.b} {c.c} {c.e} {c.f}
                    </div>
                    )}
            </div>
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
            <div>
                Notes:
                <RecordNotes record={record} />
            </div>
            <div>
                Authors:
                <ul>
                    {MARC21
                        .getFieldsAndSubfields(record.record, ["100", "110", "700", "710"], ["a", "d", "e"])
                        .map(author => <li key={author["a"][0]}>
                            <Link to={`/search?type=simple&q=${encodeURIComponent(removeLastCharacters(author["a"][0]))}`}>{removeLastCharacters(author["a"][0]) + ","}</Link>
                            {author["d"][0] && `, (${author["d"][0]})`} {author["e"].join(" ")}
                        </li>)}
                </ul>
            </div>
            <ReocrdSubjects record={record} />


            <Tabs titles={["Items", "MARC"]}>
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
            </Tabs>
        </div>
};

export default Record;