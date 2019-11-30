import React from "react";

// TODO: MARC21 field 046 contains something

const RecordTime = ({ record, __ }) => {
    try {
        const oo8 = record.record.FIELDS["008"][0].substring(6, 7);
        const first = record.record.FIELDS["008"][0].substring(7, 11);
        const second = record.record.FIELDS["008"][0].substring(11, 15);

        const title = (() => {
            switch (oo8) {
                case "c": return `${__("Currently published")}: ${first}-`
                case "d": return `${__("Ceased publishing")}: ${first}-${second}`;
                case "e": return `${__("Detailed date")}: ${second.substring(2)}.${second.substring(0, 2)}.${first}`;
                case "n": return `${__("Dates unknown")}`;
                case "q": return `${__("Questionable data")}: ${first}-${second}`;
                case "s": return `${first}`;
                case "b": return `${__("BC")}`;
            }
        })();

        console.log("datetimething", title, oo8, first, second);

        return (
            <div>
                {title}
            </div>
        );
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

export default RecordTime;