import React, { useEffect } from "react";
import { Tabs, Tab, AddressedTabs } from "../Tabs";
import { connect } from "react-redux";
import { getRecord, removeRecord, createRecord } from "../../reducers/recordReducer";
import MARCEditor from "./MARCEditor";
import Record from "../record/Record";
import Loader from "../Loader";
import RecordItems from "./RecordItems";
import SimpleRecordEditor from "./SimpleRecordEditor";

const StaffEditRecord = ({ state, id, record, getRecord, removeRecord, createRecord }) => {

    useEffect(() => {
        console.log(id);
        console.log(id === "preview" && record.result && record.result.id === "preview", id, record, record.result && record.result.id.id);
        if (!(id === "preview" || record.result && record.result.id === "preview") || id !== (record.result && record.result.id)) getRecord(id);
    }, [id]);

    if (state.state === 1) return <Loader />
    if (state.state === 3) return <p>Error: {state.error}</p>;

    const hasItems = record.result && record.result.items && record.result.items.length !== 0
    const isPreview = record && record.result && record.result.id === "preview";

    const onSaveToDatabase = () => {
        createRecord(record.result.record);
    };

    const onRemoveRecord = () => {
        removeRecord();
    };

    return <>
        {(record && record.result && record.result.id && record.result.id === "preview") && <button onClick={onSaveToDatabase}>Save to database</button>}
        <AddressedTabs titles={["Preview |", "Items |", "MARC |", "Simple editor |", "Remove "]}
            addresses={["", "items", "marc", "simple", "remove"]}
            root={`staff/record/${id}`}>
            <Tab>
                <Record id={id} isPreview={true} />
            </Tab>
            <Tab>
                <RecordItems />
            </Tab>
            <Tab>
                <MARCEditor />
            </Tab>
            <Tab>
                <SimpleRecordEditor />
            </Tab>
            <Tab>
                {isPreview && <p>You are watching record in preview mode. Record has not yet been saved to the database.</p>}
                {hasItems && <p>All items attached to this record must be removed before removing the record.</p>}
                <button onClick={onRemoveRecord} disabled={isPreview || hasItems}>Remove this record</button>
            </Tab>
        </AddressedTabs>
    </>
};

export default connect(
    state => ({
        state: state.loading.record,
        record: state.record.record
    }),
    { getRecord, removeRecord, createRecord }
)(StaffEditRecord);