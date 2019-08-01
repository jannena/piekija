import React from "react";

const MARC21 = require("../../server/utils/marc21parser");

const MARC21Screen = ({ parsedMARC }) => {
    const simpleField = data => <>
        <td colSpan={2}>{data}</td>
    </>;
    const field = data => <>
        <td>{data.indicators.join(" ")}</td>
        <td>{Object
            .entries(data.subfields)
            .map(([subfieldCode, subfield]) =>
                subfield.map((sf, i) =>
                    <span style={{ paddingLeft: 10 }} key={i}>|{subfieldCode} {sf}</span>
                )
            )}
        </td>
    </>;

    return (
        <div>
            <div>LEADER: {parsedMARC.LEADER}</div>
            <table>
                <tbody>
                    {Object.entries(parsedMARC.FIELDS)
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map(([fieldNumber, fieldData]) =>
                            fieldData.map((data, i) =>
                                <tr key={i}>
                                    {console.log("fieldData", fieldData)}
                                    <td>{fieldNumber}</td>
                                    {typeof data === "string" ? simpleField(data) : field(data)}
                                </tr>)

                        )}
                </tbody>
            </table>
        </div>
    );
};

export default MARC21Screen;