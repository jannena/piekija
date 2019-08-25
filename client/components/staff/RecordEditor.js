import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecord, updateRecord } from "../../reducers/recordReducer";

const MARC21 = require("../../../server/utils/marc21parser");

// TODO: Success and error messages

const RecordEditor = ({ id, record, getRecord, updateRecord }) => {
    console.log("editing", record);

    const [editedRecord, setEditedRecord] = useState(null);

    useEffect(() => {
        console.log(id);
        getRecord(id);
    }, [id]);

    const fieldSortFunction = ([a], [b]) => Number(a) - Number(b);

    useEffect(() => {
        if (record && record.record && record.record.FIELDS) setEditedRecord({
            ...record.record,
            FIELDS: Object.entries(record.record.FIELDS).sort(fieldSortFunction)
        });
    }, [record]);

    if (!record.record || !editedRecord) return null;

    const fieldSeparatorStyle = {
        borderTop: "2px solid black"
    };


    const onAddField = e => {
        e.preventDefault();
        // TODO: Fields 001-009!!!!!!!!

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
        setEditedRecord({
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

    // TODO: ADD KEYS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return (
        <table style={{ width: "100%" }}>
            <tbody>
                <tr>
                    <td>Add field</td>
                    <td><form onSubmit={onAddField}>
                        <input name="field" maxLength="3" minLength="3" />
                        <button>Add field</button>
                    </form></td>
                </tr>
                {editedRecord.FIELDS.map(([code = "000", fieldsData = {}], field) => <React.Fragment key={code}>
                    {fieldsData.map((fieldData, i) => <React.Fragment key={i}>
                        {console.log(fieldData, fieldData.subfields)}
                        <tr><td colSpan="3" style={fieldSeparatorStyle}></td></tr>
                        <tr>
                            <td>{code}</td>
                            <td>
                                {fieldData.subfields && <form onSubmit={onAddSubfield(code, field, i)}>
                                    <input name="subfield" minLength="1" maxLength="1" />
                                    <button>Add subfield</button>
                                </form>}
                                <button onClick={onRemoveField(code, i)}>Remove field</button>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                {fieldData.indicators ? <>
                                    <input value={fieldData.indicators[0]} onChange={onIndicatorChange(field, i, 0)} />
                                    <input value={fieldData.indicators[1]} onChange={onIndicatorChange(field, i, 1)} />
                                </>
                                    : <input value={fieldData} onChange={onFieldChange(code)} />}
                            </td>
                        </tr>
                        {fieldData.subfields && Object.entries(fieldData.subfields).map(([subfieldCode, subfieldData]) =>
                            <React.Fragment key={subfieldCode}>
                                <tr>
                                    <td>{subfieldCode}</td>
                                </tr>
                                {subfieldData.map((value, n) => <tr key={n}>
                                    <td></td>
                                    <td>
                                        <input value={value} onChange={onSubfieldChange(field, i, subfieldCode, n)} />
                                        <button onClick={onRemoveSubfield(field, i, subfieldCode, n)}>Remove subfield</button>
                                    </td>
                                </tr>)}
                            </React.Fragment>)}
                    </React.Fragment>)}
                </React.Fragment>)}
                <tr><td colSpan={3}><button onClick={onSave}>Save</button></td></tr>
            </tbody>
        </table>
    );
};

export default connect(
    state => ({
        record: state.record.record
    }),
    { getRecord, updateRecord }
)(RecordEditor);