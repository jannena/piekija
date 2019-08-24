import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getRecord, updateRecord } from "../../reducers/recordReducer";

const RecordEditor = ({ id, record, getRecord }) => {
    console.log("editing", record);

    useEffect(() => {
        console.log(id);
        getRecord(id);
    }, [id]);

    if (!record.record) return null;

    const marcData = {
        ...record.record,
        FIELDS: Object.entries(record.record.FIELDS).sort(([a], [b]) => Number(a) - Number(b))
    };

    // TODO: ADD KEYS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return (
        <table>
            {marcData.FIELDS.map(([code = "000", fieldsData = {}]) => <React.Fragment key={code}>
                {fieldsData.map(fieldData => <React.Fragment key={JSON.stringify(fieldData)}>
                    {console.log(fieldData, fieldData.subfields)}
                    <tr>
                        <td>{code}</td>
                        <td>
                            <input value={fieldData.indicators && fieldData.indicators[0]} />
                            <input value={fieldData.indicators && fieldData.indicators[1]} />
                        </td>
                    </tr>
                    {fieldData.subfields && Object.entries(fieldData.subfields).map(([subfieldCode, subfieldData]) =>
                        <React.Fragment>
                            <tr>
                                <td>{subfieldCode}</td>
                            </tr>
                            {subfieldData.map(value => <tr>
                                <td></td>
                                <td>
                                    <input value={value} />
                                </td>
                            </tr>)}
                        </React.Fragment>)}
                </React.Fragment>)}
            </React.Fragment>)}
        </table>
    );
};

export default connect(
    state => ({
        record: state.record.record
    }),
    { getRecord, updateRecord }
)(RecordEditor);