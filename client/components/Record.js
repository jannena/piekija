import React, { useState, useEffect } from "react";
import recordService from "../services/recordService";
import { Link } from "react-router-dom";

const Record = ({ id, history: { goBack } }) => {
    const [record, setRecord] = useState(null);

    console.log(id);
    console.log("record", record);

    useEffect(() => {
        recordService
            .get(id)
            .then(result => {
                setRecord(result);
                console.log("received record", result);
            })
            .catch(err => {
                console.log(JSON.parse(JSON.stringify(err)), err.message);
            });
    }, [id]);

    return !record
        ? <p>Loading...</p>
        : <div>
            <button onClick={goBack}>&lt; Back</button>
            <h2>{record.title}</h2>
            <h3>{record.author}</h3>
            <div>
                Subjects:
                <ul>
                    {record.subjects.map(s => <li key={s}><Link to={`/search?q=${encodeURI(s)}`}>{s}</Link></li>)}
                </ul>
            </div>
        </div>
};

export default Record;