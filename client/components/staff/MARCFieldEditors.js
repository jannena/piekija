import React from "react";
import { Form, Button, Input, FormSelect } from "../essentials/forms";

const MARC21 = require("../../../server/utils/marc21parser");

const LEADER05 = "acdnp";
const LEADER07 = "abcdims";
const LEADER17 = " 1234578uz";
const LEADER18 = " acinu";
const LEADER19 = " abc";

export const EditLEADER = ({ __, record, setRecord, close }) => {
    const L = record.LEADER;

    if (!L) return null;

    const onSave = e => {
        const A = L.split("");
        A[5] = e.target["LEADER-05"].value;
        A[6] = e.target["LEADER-06"].value;
        A[7] = e.target["LEADER-07"].value;
        A[17] = e.target["LEADER-17"].value;
        A[18] = e.target["LEADER-18"].value;
        A[19] = e.target["LEADER-19"].value;
        record.LEADER = A.join("");
        setRecord(record);
        close();
    };

    // const L = record.LEADER;
    console.log(L);
    return <tr><td colSpan={3}>
        <Form onSubmit={onSave}>
            <FormSelect title={`05 - ${__("Record status")}`} id="LEADER-05" options={LEADER05.split("").map(c => ([`${c} - ${__(`LEADER05-${c}`)}`, c]))} selected={L[5]} />
            <FormSelect title={`06 - ${__("Type of record")}`} id="LEADER-06" options={MARC21.contentTypes.map(c => ([`${c} - ${__(c)}`, c]))} selected={L[6]} />
            <FormSelect title={`07 - ${__("Bibliographic level")}`} id="LEADER-07" options={LEADER07.split("").map(c => ([`${c} - ${__(`LEADER07-${c}`)}`, c]))} selected={L[7]} />
            <FormSelect title={`17 - ${__("Encoding level")}`} id="LEADER-17" options={LEADER17.split("").map(c => ([`${c} - ${__(`LEADER17-${c}`)}`, c]))} selected={L[17]} />
            <FormSelect title={`18 - ${__("Descriptive cataloging form")}`} id="LEADER-18" options={LEADER18.split("").map(c => ([`${c} - ${__(`LEADER18-${c}`)}`, c]))} selected={L[18]} />
            <FormSelect title={`19 - ${__("Multipart resource record level")}`} id="LEADER-19" options={LEADER19.split("").map(c => ([`${c} - ${__(`LEADER19-${c}`)}`, c]))} selected={L[19]} />
            <Button title={__("save-button")} />
        </Form>
    </td></tr>;
};

export const Edit008 = () => {
    return <>
        <p>asd</p>
    </>;
};