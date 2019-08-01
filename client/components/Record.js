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
                Classification: Coming soon
            </div>
            <div>
                ISBN/ISSN tms. ...: Coming soon
            </div>
            <div>
                Publisher: ...? ?Coming soon?
            </div>
            <div>
                Appearance: Coming soon
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
                    <div>eka</div>
                </Tab>
                <Tab>
                    {/* TODO: Maybe search engine for MARC21 fields? */}
                    <MARC21Screen parsedMARC={record.record} />
                </Tab>
            </Tabs>
        </div>
};

export default Record;