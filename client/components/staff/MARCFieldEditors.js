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

const F00806 = "bcdeikmnpqrstu|";

export const Edit008 = ({ __, record, setRecord, close }) => {
    console.log(record);
    let i = -1;
    let F008 = record.FIELDS.filter((c, index) => (c[0] === "008" && (i = index || true)))[0][1][0];
    console.log(F008);

    const onSave = e => {
        let A = F008.split("");
        console.log(A);
        A[6] = e.target["F008-06"].value;
        A.splice(7, 4, ...e.target["F008-0710"].value);
        A.splice(11, 4, ...e.target["F008-1114"].value);
        A.splice(15, 3, ...e.target["F008-1517"].value);
        A.splice(35, 3, ...e.target["F008-3537"].value);
        console.log("Index is", i);
        record.FIELDS[i][1][0] = A.join("");
        setRecord(record);
        close();
    };

    return <tr><td colSpan={3}>
        <Form onSubmit={onSave}>
            <FormSelect id={"F008-06"} title={`06 - ${__("Type of date/Publication status")}`} options={F00806.split("").map(c => [`${c} - ${__(`F00806-${c}`)}`, c])} selected={F008[6]} />
            <Input id={"F008-0710"} title={`07-10 - ${__("Date 1")}`} options={[]} value={F008.slice(7, 11)} />
            <Input id={"F008-1114"} title={`11-14 - ${__("Date 2")}`} options={[]} value={F008.slice(11, 15)} />
            <FormSelect id={"F008-1517"} title={`15-17 - ${__("Place of publication, production, or execution")}`} options={MARC21.countries.map(c => [`${c} - ${__(`coun-${c}`)}`, c])} selected={F008.slice(15, 18)} />
            <FormSelect id={"F008-3537"} title={`35-37 - ${__("Language")}`} options={MARC21.languages.map(c => [`${c} - ${__(`lang-${c}`)}`, c])} selected={F008.slice(35, 38)} />
            <Button className="save-008-button" title={__("save-button")} />
        </Form>
    </td></tr>;
};