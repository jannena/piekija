import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecord, updateRecord, createTemporaryRecord } from "../../reducers/recordReducer";
import __ from "../../langs";
import { EditLEADER, Edit008 } from "./MARCFieldEditors";

const MARC21 = require("../../../server/utils/marc21parser");


const RecordEditor = ({ record, updateRecord, createTemporaryRecord, __ }) => {
    console.log("editing", record);

    const [editedRecord, setEditedRecord] = useState(null);
    const [editLEADER, setEditLEADER] = useState(false);
    const [edit008, setEdit008] = useState(false);

    const fieldSortFunction = ([a], [b]) => Number(a) - Number(b);

    useEffect(() => {
        if (record && record.record && record.record.FIELDS) setEditedRecord({
            ...record.record,
            FIELDS: Object.entries(record.record.FIELDS).sort(fieldSortFunction)
        });
    }, [record]);

    if (!record.record || !editedRecord) return null;

    const fieldSeparatorStyle = {
        height: 10
    };

    const indicatorInputStyle = {
        width: 40
    };

    const onLEADERChange = e => {
        setEditedRecord({
            ...editedRecord,
            LEADER: e.target.value
        });
    };


    const onAddField = e => {
        e.preventDefault();
        
        const field = e.target.field.value;
        console.log("addign field", field, Number(field), field.length);
        if (field.length !== 3 || isNaN(Number(field))) return console.log("malformatted field code");

        if (Number(field) < 10) {
            if (editedRecord.FIELDS.some(([code]) => field === code)) return console.log("this field already exists");
            else setEditedRecord({
                ...editedRecord,
                FIELDS: editedRecord.FIELDS.concat([[field, [""]]]).sort(fieldSortFunction)
            });
        }

        else if (editedRecord.FIELDS.some(([code]) => code === field)) setEditedRecord({
            ...editedRecord,
            FIELDS: editedRecord.FIELDS.map(([code, data]) =>
                [code, data.concat(field === code ? { subfields: {}, indicators: [" ", " "] } : [])]
            )
        });
        else setEditedRecord({
            ...editedRecord,
            FIELDS: editedRecord.FIELDS.concat([[field, [{ subfields: {}, indicators: [" ", " "] }]]]).sort(fieldSortFunction)
        });

        console.log("tried to add field", editedRecord);
    };

    const onAddSubfield = (fieldNumber, field, i) => e => {
        e.preventDefault();

        console.log("adding subfield", field, i);
        if (isNaN(fieldNumber) || Number(fieldNumber) < 10) return console.log("this field cannot have subfields");

        const subfield = e.target.subfield.value;
        if (!subfield || subfield.length !== 1) return console.log("malformatted subfield code");
        const copy = { ...editedRecord };

        if (copy.FIELDS[field][1][i].subfields[subfield] === undefined) copy.FIELDS[field][1][i].subfields[subfield] = [""];
        else copy.FIELDS[field][1][i].subfields[subfield].push("");

        setEditedRecord(copy);
    };

    const onSubfieldChange = (field, i, subfield, n) => e => {
        // const edited = {
        //     ...editedRecord,
        //     FIELDS: editedRecord.FIELDS.map(([code, data]) => code === field ? [
        //         [code, data.map((value, i) => )]
        //     ] : [code, data])
        // };
        console.log("tried to edit", field, i, subfield, n, editedRecord.FIELDS[field][1][i]);
        const copy = { ...editedRecord };
        copy.FIELDS[field][1][i].subfields[subfield][n] = e.target.value;
        setEditedRecord(copy);
    };
    const onIndicatorChange = (field, i, n) => e => {
        const newIndicator = e.target.value.length === 2 ? e.target.value[1] : e.target.value;
        if (!newIndicator || newIndicator.length !== 1) return console.log("malformatted indicator");

        const copy = { ...editedRecord };
        copy.FIELDS[field][1][i].indicators[n] = newIndicator;
        setEditedRecord(copy);
    };
    const onRemoveField = (field, i) => () => {
        if (editedRecord.FIELDS.some(([fieldI, content]) => fieldI === field && content.length <= 1))
            setEditedRecord({
                ...editedRecord,
                FIELDS: editedRecord.FIELDS.filter(([fieldI]) => fieldI !== field)
            });
        else
            etEditedRecord({
                ...editedRecord,
                FIELDS: editedRecord.FIELDS.map(([code, data]) => [code,
                    code === field
                        ? data.filter((d, index) => index !== i)
                        : data
                ])
            });
    };
    const onRemoveSubfield = (field, i, subfield, n) => () => {
        const copy = { ...editedRecord };
        copy.FIELDS[field][1][i].subfields[subfield].splice(n, 1);
        if (copy.FIELDS[field][1][i].subfields[subfield].length === 0) delete copy.FIELDS[field][1][i].subfields[subfield];
        setEditedRecord(copy);
    };
    const onFieldChange = field => e => {
        const { value } = e.target;
        console.log("trying to change to", value);
        setEditedRecord({
            ...editedRecord,
            FIELDS: editedRecord.FIELDS.map(([code, data]) => [code,
                code === field ? [value] : data
            ])
        });
    };
    const onSave = e => {
        // e.preventDefault();
        const joo = MARC21.stringify({
            ...editedRecord,
            FIELDS: Object.fromEntries(editedRecord.FIELDS)
        });
        console.log(joo);
        updateRecord(record.result.id, joo);
    };
    const onPreviewSave = e => {
        // e.preventDefault();
        const joo = MARC21.stringify({
            ...editedRecord,
            FIELDS: Object.fromEntries(editedRecord.FIELDS)
        });
        console.log(joo);
        createTemporaryRecord(joo, record.result);
    };

    // TODO: ADD KEYS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return (
        <>
            <div id="top" style={{ margin: "20px 0px" }}>
                {__("Fields in this record")}: {editedRecord.FIELDS.map(([code]) => <><a href={`#field-${code}`}>{code}</a>, </>)}
            </div>
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td>{__("Add field")}</td>
                        <td><form onSubmit={onAddField}>
                            <input name="field" maxLength="3" minLength="3" />
                            <button>{__("Add field")}</button>
                        </form></td>
                    </tr>
                    <tr><td colSpan="3" style={fieldSeparatorStyle}><hr /></td></tr>
                    <tr>
                        <td>LEADER</td>
                        <td><input onChange={onLEADERChange} value={editedRecord.LEADER} /></td>
                        <td><button onClick={() => setEditLEADER(!editLEADER)}>{__("edit-button") + " LEADER"}</button></td>
                    </tr>
                    {editLEADER && <EditLEADER __={__} record={editedRecord} close={() => setEditLEADER(false)} setRecord={setEditedRecord} />}
                    {editedRecord.FIELDS.map(([code = "000", fieldsData = {}], field) => <React.Fragment key={code}>
                        {fieldsData.map((fieldData, i) => <React.Fragment key={i}>
                            {/* console.log(fieldData, fieldData.subfields) */}
                            <tr><td colSpan="3" style={fieldSeparatorStyle}><hr /></td></tr>
                            <tr>
                                <td id={`field-${code}`}>{code} <a href="#top">{__("back-to-top")}</a></td>
                                <td>
                                    {fieldData.indicators ? <>
                                        <input style={indicatorInputStyle} value={fieldData.indicators[0]} onChange={onIndicatorChange(field, i, 0)} />
                                        <input style={indicatorInputStyle} value={fieldData.indicators[1]} onChange={onIndicatorChange(field, i, 1)} />
                                    </>
                                        : <input value={fieldData} onChange={onFieldChange(code)} />}
                                </td>
                                <td style={{ display: "flex" }}>
                                    {fieldData.subfields && <form onSubmit={onAddSubfield(code, field, i)}>
                                        <input name="subfield" minLength="1" maxLength="1" />
                                        <button>{__("Add subfield")}</button>
                                    </form> || (code === "008" && <button onClick={() => setEdit008(!edit008)}>{`${__("edit-button")} ${code}`}</button>)}
                                    <button onClick={onRemoveField(code, i)}>{__("Remove field")}</button>
                                </td>
                            </tr>
                            {code === "008" && edit008 && <Edit008 __={__} record={editedRecord} setRecord={setEditedRecord} close={() => setEdit008(false)} />}
                            {fieldData.subfields && Object.entries(fieldData.subfields).map(([subfieldCode, subfieldData]) =>
                                <React.Fragment key={subfieldCode}>
                                    <tr>
                                        <td>{subfieldCode}</td>
                                    </tr>
                                    {subfieldData.map((value, n) => <tr key={n}>
                                        <td></td>
                                        <td>
                                            <input value={value} onChange={onSubfieldChange(field, i, subfieldCode, n)} />
                                            <button onClick={onRemoveSubfield(field, i, subfieldCode, n)}>x</button>
                                        </td>
                                    </tr>)}
                                </React.Fragment>)}
                        </React.Fragment>)}
                    </React.Fragment>)}
                    <tr><td colSpan={3}><button onClick={onSave}>{__("save-button")}</button></td></tr>
                    <tr><td colSpan={3}><button onClick={onPreviewSave}>{__("Save for preview")}</button></td></tr>
                </tbody>
            </table>
        </>
    );
};

export default connect(
    state => ({
        record: state.record.record,
        __: __(state)
    }),
    { getRecord, updateRecord, createTemporaryRecord }
)(RecordEditor);