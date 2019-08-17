import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordStandardCodes = ({ record }) => {
    const isbn = MARC21.getFieldsAndSubfields(record.record, ["020"], ["a"]);
    const issn = MARC21.getFieldsAndSubfields(record.record, ["022"], ["a"]);
    const others = MARC21.getFieldsAndSubfields(record.record, ["024"], ["a", "indicators"]);

    return (
        <div>
            <div>{!!isbn.length && `ISBN: ${isbn.map(i => i.a).join(", ")}`}</div>
            <div>{!!issn.length && `ISSN: ${issn.map(i => i.a).join(", ")}`}</div>
            <div> {
                others.map(code => <div key={code.a}>
                    {["ISRC", "UPC", "ISMN", "EAN", "SICI", "", "", "", "NO TYPE"][Number(code.indicators[0]) || 8]} {code.a[0]}
                </div>
                )}
            </div>
        </div>
    );
};

export default RecordStandardCodes;