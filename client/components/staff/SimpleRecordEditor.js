import React from "react";
import Select from "../Select";
import Loader from "../Loader";
import { connect } from "react-redux";
import __ from "../../langs";

const MARC21 = require("../../../server/utils/marc21parser");

// TODO: Translate

const SimpleRecordEditor = ({ record, __ }) => {
    if (!record.result || !record.record) return <Loader />

    return (
        <div>
            <h2>Basic</h2>
            <div>
                Title
                <input placeholder="Title" defaultValue={record.result.title} />
                <input placeholder="Sub-title" defaultValue={MARC21.getFieldsAndSubfields(record.record, ["245"], ["b"]).map(s => s.b).join("")} />
            </div>

            <div>
                Content type
                <Select options={MARC21.contentTypes.map(c => [__(c), c])} />
            </div>

            <div>Year <input type="number" placeholder="year" maxLength={4} /></div>

            <div>
                Main author
                {(() => {
                    const author = MARC21.getFieldsAndSubfields(record.record, ["100", "110"], ["a", "d", "e"]).filter(s => s.a)[0] || [];
                    return <>
                        <Select options={[["personal", "100"], ["corporate", "110"]]} />
                        <input defaultValue={author["a"]} />
                        (<input defaultValue={author["d"]} />)
                        <input defaultValue={author["e"]} />
                    </>;
                })()}
            </div>

            <hr />

            <div>
                <h2>Classification</h2>
                {(() => {
                    const other = MARC21.getFieldsAndSubfields(record.record, ["084"], ["a", "2"]);
                    console.log("other classification", other);
                    return <>
                        {other.filter(c => !c["2"] || c["2"][0] === "ykl").map(c => <div>
                            ykl
                            <input value={c.a} />
                        </div>)}
                        <button>Add</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                <h2>Standard codes</h2>
                {(() => {
                    const isbn = MARC21.getFieldsAndSubfields(record.record, ["020"], ["a"]);
                    const ean = MARC21.getFieldsAndSubfields(record.record, ["024"], ["indicators", "a"]);
                    console.log("EAN", ean);
                    return <>
                        {isbn.map(i => <div key={JSON.stringify(i)}>
                            ISBN:
                            <input value={i.a} />
                        </div>)}
                        {ean.filter(s => s.indicators[0] === "3").map(i => <div key={JSON.stringify(i)}>
                            EAN:
                            <input value={i.a} />
                        </div>)}
                        <button>Add ISBN</button>
                        <button>Add EAN</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const authors = MARC21.getFieldsAndSubfields(record.record, ["700", "710"], ["a", "d", "e"]);
                    return <>
                        <h2>Other authors</h2>
                        {authors.map(a => <div key={JSON.stringify(a)}>
                            {/* TODO: Type (i.e. marc field code) */}
                            <input placeholder="name, (last name, first name)" defaultValue={a["a"]} />,
                            (<input placeholder="when did they live?" defaultValue={a["d"]} />),
                            <input placeholder="what did they do?" defaultValue={a["e"]} />
                        </div>)}
                        <button>Add</button>
                    </>;
                })()}
            </div>

            <hr />

            <div>
                {(() => {
                    const subjects = MARC21.getFieldsAndSubfields(record.record, ["600", "650", "655", "653"], ["a", "x", "y", "z"]);
                    return <>
                        <h2>Subjects</h2>
                        {subjects.map(a => <div key={JSON.stringify(a)}>
                            <input placeholder="subject" defaultValue={a["a"]} /> --&gt;
                            <input placeholder="additional" defaultValue={a["x"]} /> --&gt;
                            <input placeholder="when?" defaultValue={a["y"]} /> --&gt;
                            <input placeholder="where?" defaultValue={a["z"]} />
                        </div>)}
                        <button>Add</button>
                    </>
                })()}
            </div>

            {/* TODO: Standard codes */}
            {/* TODO: Classification */}
            {/* TODO: Notes */}
            {/* TODO: Contents */}
            {/* TODO: Appearance */}
        </div>
    );
};

export default connect(
    state => ({
        record: state.record.record,
        __: __(state)
    })
)(SimpleRecordEditor);