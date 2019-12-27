import React, { useState, useEffect } from "react";
import Select from "../Select";
import Loader from "../Loader";
import { connect } from "react-redux";
import { updateRecord } from "../../reducers/recordReducer";
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");

// TODO: Translate
// TODO: Clean

// TODO: Things go bad after simple editor save

const SimpleRecordEditor = ({ updateRecord, record2, __ }) => {
    const [record, setRecord] = useState(null);
    useEffect(() => {
        setRecord(record2);
    }, [record2]);
    if (!record || !record.result || !record.record) return <Loader />

    window.testailenvaan = record;

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

    const handleUpdateRecord = () => {
        updateRecord(record2.result.id, MARC21.stringify(record.record));
    };

    return (
        <div>
            <h2>Basic</h2>
            <div>
                Title
                {(() => {

                    return (record.record.FIELDS["245"] && record.record.FIELDS["245"].length > 0)
                        ? <>
                            <input placeholder="Title" onChange={handleChangeValue("245", 0, "a")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["a"]).map(s => s.a).join("")} />
                            <input placeholder="Sub-title" onChange={handleChangeValue("245", 0, "b")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["b"]).map(s => s.b).join("")} />
                        </>
                        : <button onClick={handleAddField("245")({ subfields: { a: [""], b: [""] }, indicators: [" ", " "] })}>Add title</button>;
                })()}
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
                    const author = MARC21.getFieldsAndSubfields(record.record, ["100"], ["a"]).filter(s => s.a)[0] || null;
                    return author
                        ? <input onChange={handleChangeValue("100", 0, "a")} value={author["a"]} />
                        : <button onClick={handleAddField("100")({ subfields: { a: [""] }, indicators: ["1", " "] })}>Add author</button>
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
                            <input onChange={handleChangeValue("084", i, "a")} value={c.a} />
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
                        {isbn.map((s, i) => <div key={i}>
                            ISBN:
                            <input onChange={handleChangeValue("020", i, "a")} value={s.a} />
                            <button onClick={handleRemoveField("020", i)}>Remove</button>
                        </div>)}
                        {ean.map((s, i) => <div key={i}>
                            {(s.indicators[0] === "3" && "EAN:") || "OTHER"}
                            <input onChange={handleChangeValue("024", i, "a")} value={s.a} />
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
                    const authors = MARC21.getFieldsAndSubfields(record.record, ["700"], ["a", "d", "e"]);
                    const corporates = MARC21.getFieldsAndSubfields(record.record, ["710"], ["a", "d", "e"]);
                    return <>
                        <h2>Other authors</h2>
                        {authors.map((a, i) => <div key={i}>
                            personal
                            <input onChange={handleChangeValue("700", i, "a")} placeholder={__("last name, first name")} value={a["a"]} />
                            {/* (<input placeholder="when did they live?" value={a["d"]} />)
                            <input placeholder="what did they do?" value={a["e"]} /> */}
                            <button onClick={handleRemoveField("700", i)}>Remove</button>
                        </div>)}
                        <button onClick={handleAddField("700")()}>Add</button>
                        {corporates.map((a, i) => <div key={JSON.stringify(a)}>
                            corporate
                            <input disabled value={a["a"]} />
                            {/* (<input placeholder="when did they live?" value={a["d"]} />)
                            <input placeholder="what did they do?" value={a["e"]} /> */}
                            <button onClick={handleRemoveField("710", i)}>Remove</button>
                        </div>)}
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const printSubjects = field =>
                        MARC21.getFieldsAndSubfields(record.record, [field], ["a", "x", "y", "z"])
                            .map((a, i) => <div key={`${field}-${i}`}>
                                <input onChange={handleChangeValue(field, i, "a")} /* placeholder="subject" */ defaultValue={a["a"]} /> --&gt;
                                <input onChange={handleChangeValue(field, i, "x")} /* placeholder="additional" */ defaultValue={a["x"]} /> --&gt;
                                <input onChange={handleChangeValue(field, i, "y")} /* placeholder="when?" */ defaultValue={a["y"]} /> --&gt;
                                <input onChange={handleChangeValue(field, i, "z")} /* placeholder="where?" */ defaultValue={a["z"]} />
                                <button onClick={handleRemoveField(field, i)}>Remove</button>
                            </div>);
                    return <>
                        <h2>Subjects</h2>
                        {printSubjects("650")}
                        {printSubjects("655")}
                        {printSubjects("653")}
                        <button onClick={handleAddField("653")({ subfields: { a: [""], x: [""], y: [""], z: [""] }, indicators: ["3", " "] })}>Add (653)</button>
                        {/* TODO: Does not work this way (check preview) */}
                    </>
                })()}
            </div>

            <button onClick={handleUpdateRecord}>Save</button>


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
    }),
    { updateRecord }
)(SimpleRecordEditor);