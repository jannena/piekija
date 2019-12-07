import React, { useEffect } from "react";
import { Tab, AddressedTabs } from "../Tabs";
import { connect } from "react-redux";
import { getRecord, removeRecord, createRecord } from "../../reducers/recordReducer";
import MARCEditor from "./MARCEditor";
import Record from "../record/Record";
import Loader from "../Loader";
import RecordItems from "./RecordItems";
import SimpleRecordEditor from "./SimpleRecordEditor";
import { withRouter } from "react-router-dom";
import __ from "../../langs";

const StaffEditRecord = ({ state, id, record, getRecord, removeRecord, createRecord, history, __ }) => {

    useEffect(() => {
        console.log(id);
        console.log(id === "preview" && record.result && record.result.id === "preview", id, record, record.result && record.result.id.id);
        if (!(id === "preview" || record.result && record.result.id === "preview") || id !== (record.result && record.result.id)) getRecord(id);
    }, [id]);

    if (state.state === 1) return <Loader />
    if (state.state === 3) return <p>{__("Error")}: {state.error}</p>;

    const hasItems = record.result && record.result.items && record.result.items.length !== 0
    const isPreview = record && record.result && record.result.id === "preview";

    const onSaveToDatabase = () => {
        // TODO: change page to record just created
        createRecord(record.result.record);
    };

    const onRemoveRecord = () => {
        removeRecord();
    };

    const recordTools = () => {
        if (record && record.result && record.result.id && record.result.id === "preview") return <button onClick={onSaveToDatabase}>{__("Save to database")}</button>;
        else return <>
            <button onClick={() => history.push(`/staff/records`)}>{__("Back to staff screen")}</button>
            <button onClick={() => history.push(`/record/${id}`)}>{__("Preview as normal user")}</button>
        </>;
    };

    return <>
        {recordTools()}

        <AddressedTabs titles={[__("preview-tab"), __("items-tab"), __("MARC-tab"), __("simple-editor-tab"), __("remove-tab")]}
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
                {isPreview && <p>{__("watching-preview-info")}</p>}
                {hasItems && <p>{__("cannot-remove-items-info")}</p>}
                <button onClick={onRemoveRecord} disabled={isPreview || hasItems}>{__("Remove this record")}</button>
            </Tab>
        </AddressedTabs>
    </>
};

export default connect(
    state => ({
        state: state.loading.record,
        record: state.record.record,
        __: __(state)
    }),
    { getRecord, removeRecord, createRecord }
)(withRouter(StaffEditRecord));