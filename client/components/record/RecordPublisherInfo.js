import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordPublisherInfo = ({ record }) => {
    return (
        <>
            {MARC21
                .getFieldsAndSubfields(record.record, ["264"], ["indicators", "a", "b", "c"])
                .map((field, i) =>
                    <tr key={field.indicators[1]}>
                        <td>{["Production", "Publication", "Distribution", "Manufacture", "Copyright notice date"][Number(field.indicators[1])]}</td>
                        <td>{field.a} {field.b} {field.c}</td>
                    </tr>
                )}
            {MARC21
                .getFieldsAndSubfields(record.record, ["260"], ["a", "b", "c", "e", "f"])
                .map(c => <tr key={c.a}>
                    <td>Publisher</td>
                    <td>{c.a} {c.b} {c.c} {c.e} {c.f}</td>
                </tr>
                )}
        </>
    )
};

export default RecordPublisherInfo;