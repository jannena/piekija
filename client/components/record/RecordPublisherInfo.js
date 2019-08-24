import React from "react";

const MARC21 = require("../../../server/utils/marc21parser");

const RecordPublisherInfo = ({ record }) => {
    return (
        <div>
            {MARC21
                .getFieldsAndSubfields(record.record, ["264"], ["indicators", "a", "b", "c"])
                .map((field, i) =>
                    <div key={field.indicators[1]}>
                        {["Production", "Publication", "Distribution", "Manufacture", "Copyright notice date"][Number(field.indicators[1])]}: {field.a} {field.b} {field.c}
                    </div>
                )}
            {MARC21
                .getFieldsAndSubfields(record.record, ["260"], ["a", "b", "c", "e", "f"])
                .map(c => <div key={c.a}>
                    {"Publisher / ..."} {c.a} {c.b} {c.c} {c.e} {c.f}
                </div>
                )}
        </div>
    )
};

export default RecordPublisherInfo;