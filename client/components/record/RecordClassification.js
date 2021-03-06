import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordClassification = ({ record, __ }) => {
    const LoC = MARC21.getFieldsAndSubfields(record.record, ["050"], ["a", "2"]);
    const udk = MARC21.getFieldsAndSubfields(record.record, ["080"], ["a", "2"]);
    const others = MARC21.getFieldsAndSubfields(record.record, ["084"], ["a", "2"]);

    if (LoC.length + udk.length + others.length === 0) return null;

    return (
        <tr>
            <td>{__("Classification")}</td>
            <td>
                {LoC.map((c, i) => <div key={i}>
                    {"LoC"} {c.a}
                </div>)}
                {udk.map((c, i) => <div key={i}>
                    {"udk"} {c.a}
                </div>)}
                {others.map((c, i) => <div key={i}>
                    {c["2"]} {c.a}
                </div>)}
            </td>
        </tr>
    );
};

export default RecordClassification;