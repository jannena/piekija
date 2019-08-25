import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecord, updateRecord } from "../../reducers/recordReducer";

const MARC21 = require("../../../server/utils/marc21parser");

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
        const field = e.target.field.value;
        console.log("addign field", field, Number(field), field.length);
        if (field.length !== 3 || isNaN(Number(field))) return console.log("malformatted field code");

        if (editedRecord.FIELDS.some(([code]) => code === field)) setEditedRecord({
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

    const onAddSubfield = (field, i, subfield) => {

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
    const onIndicatorChange = (field, i, indicator, n) => { };
    const onRemoveSubfield = () => { };
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
                                {fieldData.indicators ? <>
                                    <input value={fieldData.indicators[0]} />
                                    <input value={fieldData.indicators[1]} />
                                </>
                                    : <input value={fieldData} />}
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