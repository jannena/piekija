import React, { useEffect } from "react";
import { Tabs, Tab } from "../Tabs";
import { connect } from "react-redux";
import { getRecord } from "../../reducers/recordReducer";
import MARCEditor from "./MARCEditor";
import Record from "../record/Record";
import Loader from "../Loader";

const StaffEditRecord = ({ state, id, record, getRecord }) => {

    useEffect(() => {
        console.log(id);
        console.log(id === "preview" && record.result && record.result.id === "preview", id, record, record.result && record.result.id.id);
        if (!(id === "preview" || record.result && record.result.id === "preview") || id !== (record.result && record.result.id)) getRecord(id);
    }, [id]);

    if (state.state === 1) return <Loader />
    if (state.state === 3) return <p>Error: {state.error}</p>;

    return <>
        {(record && record.result && record.result.id && record.result.id === "preview") && <button>Save to database</button>}
        <Tabs titles={["Preview ", "Items ", "MARC ", "Simple editor "]}>
            <Tab>
                <Record id={id} isPreview={true} />
            </Tab>
            <Tab>
                <p>Item info...</p>
            </Tab>
            <Tab>
                <MARCEditor />
            </Tab>
        </Tabs>
    </>
};

export default connect(
    state => ({
        state: state.loading.record,
        record: state.record.record
    }),
    { getRecord }
)(StaffEditRecord);