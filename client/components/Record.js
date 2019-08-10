import React, { useState, useEffect } from "react";
import recordService from "../services/recordService";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "./Tabs";
import MARC21Screen from "./MARC21Screen";

const MARC21 = require("../../server/utils/marc21parser");

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
            <h2>{record.result.title}</h2>
            <div>
                Content type: {(record.result.contentType && MARC21.contentTypes[record.result.contentType]) || "No contentType"}
            </div>
            <div>
                {/* TODO: There is other classification fields, too!! */}
                Classification: {MARC21.getSubfields(record.record, "084", ["a", "2"]).join(" ")}
            </div>
            <hr />
            <div>
                <div>ISBN: {MARC21.getField(record.record, "020", "a")}</div>
                <div>ISSN: {MARC21.getField(record.record, "022", "a")}</div>
                <div>OTHER: {MARC21.getField(record.record, "024", "a")}</div>
            </div>
            <hr />
            <div>
                {MARC21
                    .getFieldsAndSubfields(record.record, ["264"], ["indicators", "a", "b", "c"])
                    .map((field, i) =>
                        <div>
                            {["Production", "Publication", "Distribution", "Manufacture", "Copyright notice date"][Number(field.indicators[1])]}: {field.a} {field.b} {field.c}
                        </div>
                    )}
            </div>
            <hr />
            <div>
                Appearance: {MARC21.getSubfields(record.record, "300", ["a", "b", "c", "e", "f", "g"]).join(" ")}
            </div>
            <div>
                Notes:
                <ul>
                    {/* TODO: Add note titles */}
                    {MARC21
                        .getFields(record.record, [
                            "500", "501", "502", "504", "505", "506", "507", "508",
                            "509", "510", "513", "514", "515", "516", "518", "520",
                            "521", "522", "524", "525", "526", "530", "532", "533",
                            "534", "535", "536", "538", "540", "541", "542", "544",
                            "545", "546", "547", "550", "552", "555", "556", "561",
                            "562", "563", "565", "567", "580", "581", "583", "584",
                            "585", "586", "588"
                        ], "a")
                        .map((note, i) =>
                            <li key={note}>{note}</li>
                        )}
                </ul>
            </div>
            <div>
                Authors:
                <ul>
                    {MARC21
                        .getFieldsAndSubfields(record.record, ["700"], ["a", "e"])
                        .map(author => <li key={author["a"][0]}>
                            <Link to={`/search/?type=simple&q=${author["a"][0]}`}>{author["a"][0]}</Link> {author["e"].join(", ")}
                        </li>)}
                </ul>
            </div>
            <div>
                Subjects:
                <ul>
                    {record.result.subjects.map(s => <li key={s}><Link to={`/search?q=${encodeURI(s)}`}>{s}</Link></li>)}
                </ul>
            </div>
            <div>
                Genres:
                <ul>
                    {record.result.genres.map(g => <li key={g}>{g}</li>)}
                </ul>
            </div>


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