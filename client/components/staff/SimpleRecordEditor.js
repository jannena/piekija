import React, { useState, useEffect } from "react";
import Select from "../Select";
import Loader from "../Loader";
import { connect } from "react-redux";
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");

// TODO: Translate

const SimpleRecordEditor = ({ record2, __ }) => {
    const [record, setRecord] = useState(null);
    useEffect(() => {
        setRecord(record2);
    }, [record2]);
    if (!record || !record.result || !record.record) return <Loader />

    const handleAddField = field => (data = { subfields: { a: [""] }, indicators: [" ", " "] }) => e => {
        e.preventDefault();
        const root = record.record.FIELDS;
        if (root[field]) root[field].push(data);
        else root[field] = [data];
        console.log("Tried to change thing", record)
        setRecord({ ...record });
    };

    const handleRemoveField = (field, i, data) => e => {
        e.preventDefault();
        const root = record.record.FIELDS;
        if (data && root[field]) {
            i = root[field].indexOf(data);
        }
        console.log(field, i, data, data == root[field][1]);
        if (i >= 0 && root[field]) root[field].splice(i, 1);
        setRecord({ ...record });
    };

    const handleChangeValue = (field, i, subfield) => e => {
        const root = record.record.FIELDS;
        if (!root[field][i].subfields[subfield]) root[field][i].subfields[subfield] = [""];
        root[field][i].subfields[subfield][0] = e.target.value;
        setRecord({ ...record });
    };

    const handleChangeContentTypeValue = e => {
        const edited = record.record.LEADER.split("");
        edited.splice(6, 1, e.target.value);
        setRecord({
            ...record,
            record: {
                ...record.record,
                LEADER: edited.join("")
            }
        });
    };

    const handleChangeYear = e => {
        // TODO: Fix
        const edited = record.record.FIELDS["008"][0].split("");
        console.log("!!!!!!!!!!!!", e.target.value, [...(e.target.value), ...new Array(Math.max(0, 4 - e.target.value.length)).fill(" ")]);
        edited.splice(7, 4, ...[...(e.target.value), ...new Array(Math.max(0, 4 - e.target.value.length)).fill(" ")]);
        record.record.FIELDS["008"][0] = edited.join("");
        setRecord({ ...record });
    };

    return (
        <div>
            <h2>Basic</h2>
            <div>
                Title
                <input placeholder="Title" onChange={handleChangeValue("245", 0, "a")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["a"]).map(s => s.a).join("")} />
                <input placeholder="Sub-title" onChange={handleChangeValue("245", 0, "b")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["b"]).map(s => s.b).join("")} />
            </div>

            <div>
                Content type
                <Select onChange={handleChangeContentTypeValue} selected={record.record.LEADER[6]} options={MARC21.contentTypes.map(c => [__(c), c])} />
            </div>

            <div>
                Year
                <input type="number" placeholder="year" maxLength="4"
                    onChange={handleChangeYear}
                    value={record.record.FIELDS["008"] &&
                        record.record.FIELDS["008"][0] &&
                        record.record.FIELDS["008"][0].substring(7, 11)}
                />
            </div>

            <div>
                Main author
                {(() => {
                    const author = MARC21.getFieldsAndSubfields(record.record, ["100", "110"], ["a", "d", "e"]).filter(s => s.a)[0] || [];
                    return <>
                        <input defaultValue={author["a"]} />
                        (<input defaultValue={author["d"]} />)
                        <input defaultValue={author["e"]} />
                    </>;
                })()}
            </div>

            <hr />

            <div>
                <h2>Classification</h2>
                {(() => {
                    const other = MARC21.getFieldsAndSubfields(record.record, ["084"], ["a", "2"]);
                    console.log("other classification", other);
                    return <>
                        {other.map((c, i) => <div>
                            {(!c["2"] || c["2"][0] === "ykl" && <span>ykl</span>) || "OTHER"}
                            <input value={c.a} />
                            <button onClick={handleRemoveField("084", i)}>Remove</button>
                        </div>)}
                        <button onClick={handleAddField("084")({ subfields: { a: [""], 2: ["ykl"] }, indicators: [" ", " "] })}>Add</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                <h2>Standard codes</h2>
                {(() => {
                    const isbn = MARC21.getFieldsAndSubfields(record.record, ["020"], ["a"]);
                    const ean = MARC21.getFieldsAndSubfields(record.record, ["024"], ["indicators", "a"]);
                    console.log("EAN", ean);
                    return <>
                        {isbn.map((s, i) => <div key={JSON.stringify(s)}>
                            ISBN:
                            <input value={s.a} />
                            <button onClick={handleRemoveField("020", i)}>Remove</button>
                        </div>)}
                        {ean.map((s, i) => <div key={JSON.stringify(s)}>
                            {(s.indicators[0] === "3" && "EAN:") || "OTHER"}
                            <input value={s.a} />
                            <button onClick={handleRemoveField("024", i)}>Remove</button>
                        </div>)}
                        <button onClick={handleAddField("020")()}>Add ISBN</button>
                        <button onClick={handleAddField("024")({ subfields: { a: [""] }, indicators: ["3", " "] })}>Add EAN</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const authors = MARC21.getFieldsAndSubfields(record.record, ["700", "710"], ["a", "d", "e"]);
                    return <>
                        <h2>Other authors</h2>
                        {authors.map(a => <div key={JSON.stringify(a)}>
                            {a.field === "700" ? "personal" : "corporate"}
                            <input placeholder="name, (last name, first name)" value={a["a"]} />
                            (<input placeholder="when did they live?" value={a["d"]} />)
                            <input placeholder="what did they do?" value={a["e"]} />
                        </div>)}
                        <button onClick={handleAddField("700")()}>Add (personal)</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const subjects = MARC21.getFieldsAndSubfields(record.record, ["600", "650", "655", "653"], ["a", "x", "y", "z"]);
                    return <>
                        <h2>Subjects</h2>
                        {subjects.map(a => <div key={JSON.stringify(a)}>
                            <input /* placeholder="subject" */ defaultValue={a["a"]} /> --&gt;
                            <input /* placeholder="additional" */ defaultValue={a["x"]} /> --&gt;
                            <input /* placeholder="when?" */ defaultValue={a["y"]} /> --&gt;
                            <input /* placeholder="where?" */ defaultValue={a["z"]} />
                            <button>Remove</button>
                        </div>)}
                        <button onClick={handleAddField("653")({ subfields: { a: [""], x: [""], y: [""], z: [""] }, indicators: ["3", " "] })}>Add</button>
                    </>
                })()}
            </div>

            <button>Save</button>


            {/* TODO: Notes */}
            {/* TODO: Contents */}
            {/* TODO: Appearance */}
        </div>
    );
};

export default connect(
    state => ({
        record2: state.record.record,
        __: __(state)
    })
)(SimpleRecordEditor);