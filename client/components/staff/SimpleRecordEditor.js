import React from "react";
import { connect } from "react-redux";

const MARC21 = require("../../../server/utils/marc21parser");

const SimpleRecordEditor = ({ record }) => {
    return (
        <div>
            <div><input placeholder="Title" defaultValue={record.result.title} /></div>
            <div><input placeholder="Sub-title" defaultValue={MARC21.getFieldsAndSubfields(record.record, ["245"], ["b"]).map(s => s.b).join("")} /></div>

            <input type="number" placeholder="year" maxLength={4} />

            <hr />

            <div>
                {(() => {
                    const authors = MARC21.getFieldsAndSubfields(record.record, ["100", "110", "700", "710"], ["a", "d", "e"]);
                    return authors.map(a => <div key={JSON.stringify(a)}>
                        {/* TODO: Type (i.e. marc field code) */}
                        <input placeholder="name, (last name, first name)" defaultValue={a["a"]} />,
                        (<input placeholder="when did they live?" defaultValue={a["d"]} />),
                        <input placeholder="what did they do?" defaultValue={a["e"]} />
                    </div>);
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const subjects = MARC21.getFieldsAndSubfields(record.record, ["600", "650", "655", "653"], ["a", "x", "y", "z"]);
                    return subjects.map(a => <div key={JSON.stringify(a)}>
                        {/* TODO: Type (i.e. marc field code) */}
                        <input placeholder="subject" defaultValue={a["a"]} /> --&gt; 
                        <input placeholder="additional" defaultValue={a["x"]} /> --&gt; 
                        <input placeholder="when?" defaultValue={a["y"]} /> --&gt;
                        <input placeholder="where?" defaultValue={a["z"]} />
                    </div>);
                })()}
            </div>

            {/* TODO: Standard codes */}
            {/* TODO: Classification */}
            {/* TODO: Notes */}
            {/* TODO: Contents */}
            {/* TODO: Appearance */}
        </div>
    );
};

export default connect(
    state => ({
        record: state.record.record
    })
)(SimpleRecordEditor);