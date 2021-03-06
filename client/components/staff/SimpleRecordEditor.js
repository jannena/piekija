import React, { useState, useEffect } from "react";
import Select from "../Select";
import Loader from "../Loader";
import { connect } from "react-redux";
import { updateRecord } from "../../reducers/recordReducer";
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");

const SimpleRecordEditor = ({ updateRecord, record2, __ }) => {
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
        const edited = record.record.FIELDS["008"][0].split("");
        const newYear = e.target.value + "    ";
        console.log("new year", newYear);
        for (let i = 0; i < newYear.length; i++) {
            edited[7 + i] = newYear[i];
        }
        console.log("after editing new year", newYear);
        record.record.FIELDS["008"][0] = edited.join("");
        setRecord({
            ...record,
            record: {
                ...record.record,
                FIELDS: {
                    ...record.record.FIELDS,
                    ["008"]: [edited.join("")]
                }
            }
        });
    };

    const handleUpdateRecord = () => {
        updateRecord(record2.result.id, MARC21.stringify(record.record));
    };

    return (
        <div>
            <h2>{__("Basic information")}</h2>
            <div>
                {__("Title")}
                {(() => {

                    return (record.record.FIELDS["245"] && record.record.FIELDS["245"].length > 0)
                        ? <>
                            <input placeholder={__("Title")} onChange={handleChangeValue("245", 0, "a")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["a"]).map(s => s.a).join("")} />
                            <input placeholder={__("Sub-title")} onChange={handleChangeValue("245", 0, "b")} value={MARC21.getFieldsAndSubfields(record.record, ["245"], ["b"]).map(s => s.b).join("")} />
                        </>
                        : <button onClick={handleAddField("245")({ subfields: { a: [""], b: [""] }, indicators: [" ", " "] })}>{__("Add title")}</button>;
                })()}
            </div>

            <div>
                {__("Content type")}
                <Select onChange={handleChangeContentTypeValue} selected={record.record.LEADER[6]} options={MARC21.contentTypes.map(c => [__(c), c])} />
            </div>

            <div>
                {__("Year")}
                <input type="text" placeholder="year" maxLength="4"
                    onChange={handleChangeYear}
                    value={record.record.FIELDS["008"] &&
                        record.record.FIELDS["008"][0] &&
                        record.record.FIELDS["008"][0].substring(7, 11).trimEnd()}
                />
            </div>

            <div>
                {__("Main author")}
                {(() => {
                    const author = MARC21.getFieldsAndSubfields(record.record, ["100"], ["a"]).filter(s => s.a)[0] || null;
                    return author
                        ? <input onChange={handleChangeValue("100", 0, "a")} value={author["a"]} />
                        : <button onClick={handleAddField("100")({ subfields: { a: [""] }, indicators: ["1", " "] })}>{__("Add author")}</button>
                })()}
            </div>

            <hr />

            <div>
                <h2>{__("Classification")}</h2>
                {(() => {
                    const other = MARC21.getFieldsAndSubfields(record.record, ["084"], ["a", "2"]);
                    console.log("other classification", other);
                    return <>
                        {other.map((c, i) => <div>
                            {(!c["2"] || c["2"][0] === "ykl" && <span>ykl</span>) || "OTHER"}
                            <input onChange={handleChangeValue("084", i, "a")} value={c.a} />
                            <button onClick={handleRemoveField("084", i)}>{__("remove-button")}</button>
                        </div>)}
                        <button onClick={handleAddField("084")({ subfields: { a: [""], 2: ["ykl"] }, indicators: [" ", " "] })}>{__("add-button")}</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                <h2>{__("Standard codes")}</h2>
                {(() => {
                    const isbn = MARC21.getFieldsAndSubfields(record.record, ["020"], ["a"]);
                    const ean = MARC21.getFieldsAndSubfields(record.record, ["024"], ["indicators", "a"]);
                    console.log("EAN", ean);
                    return <>
                        {isbn.map((s, i) => <div key={i}>
                            ISBN:
                            <input onChange={handleChangeValue("020", i, "a")} value={s.a} />
                            <button onClick={handleRemoveField("020", i)}>{__("remove-button")}</button>
                        </div>)}
                        {ean.map((s, i) => <div key={i}>
                            {(s.indicators[0] === "3" && "EAN:") || "OTHER"}
                            <input onChange={handleChangeValue("024", i, "a")} value={s.a} />
                            <button onClick={handleRemoveField("024", i)}>{__("remove-button")}</button>
                        </div>)}
                        <button onClick={handleAddField("020")()}>{__("Add ISBN")}</button>
                        <button onClick={handleAddField("024")({ subfields: { a: [""] }, indicators: ["3", " "] })}>{__("Add EAN")}</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const authors = MARC21.getFieldsAndSubfields(record.record, ["700"], ["a", "d", "e"]);
                    const corporates = MARC21.getFieldsAndSubfields(record.record, ["710"], ["a", "d", "e"]);
                    return <>
                        <h2>{__("Other authors")}</h2>
                        {authors.map((a, i) => <div key={i}>
                            {__("personal")}
                            <input onChange={handleChangeValue("700", i, "a")} placeholder={__("last name, first name")} value={a["a"]} />
                            {/* (<input placeholder="when did they live?" value={a["d"]} />)
                            <input placeholder="what did they do?" value={a["e"]} /> */}
                            <button onClick={handleRemoveField("700", i)}>{__("remove-button")}</button>
                        </div>)}
                        <button onClick={handleAddField("700")()}>{__("add-button")}</button>
                        {corporates.map((a, i) => <div key={JSON.stringify(a)}>
                            {__("corporate")}
                            <input disabled value={a["a"]} />
                            {/* (<input placeholder="when did they live?" value={a["d"]} />)
                            <input placeholder="what did they do?" value={a["e"]} /> */}
                            <button onClick={handleRemoveField("710", i)}>{__("remove-button")}</button>
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
                                <button onClick={handleRemoveField(field, i)}>{__("remove-button")}</button>
                            </div>);
                    return <>
                        <h2>{__("Subjects")}</h2>
                        {printSubjects("650")}
                        {printSubjects("655")}
                        {printSubjects("653")}
                        <button onClick={handleAddField("653")({ subfields: { a: [""], x: [""], y: [""], z: [""] }, indicators: ["3", " "] })}>{__("add-button")} (653)</button>
                        {/* TODO: Does not work this way (check preview) */}
                    </>
                })()}
            </div>

            <button onClick={handleUpdateRecord}>{__("save-button")}</button>
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