import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteRecordFromShelf, updateRecordInShelf } from "../reducers/shelfReducer";
import __ from "../langs"
import RecordPreview from "./RecordPreview";

const ShelfRecord = ({ record, canEdit, updateRecordInShelf, deleteRecordFromShelf, __ }) => {
    // console.log("I'm in this shelf", record);

    const [isOpen, setIsOpen] = useState(false);
    const [note, setNote] = useState(record.note || "");

    const handleEditNote = () => {
        updateRecordInShelf(record.record.id, note);
        setIsOpen(false);
    }

    const handleRemoveFromShelf = () => {
        deleteRecordFromShelf(record.record.id);
    };

    const cancelEditing = () => {
        setIsOpen(false);
        setNote(record.note || "");
    };

    // TODO: note update after note update does not work

    // console.log("difference", !!state.shelf.shelf.records && state.shelf.shelf.records[3].note, record.note);

    const recordDeleted = record.record.id === undefined;

    return <RecordPreview record={record.record} __={__}>
        <div>
            <div>
                {isOpen
                    ? <>
                        <input value={note} onChange={e => setNote(e.target.value)} />
                        <button onClick={handleEditNote}>{__("save-button")}</button>
                        <button onClick={cancelEditing}>{__("cancel-button")}</button>
                    </>
                    : record.note}
            </div>
            <div style={{ height: 50 }}></div>
            <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                {canEdit && <>
                    {recordDeleted ? <p></p> : <button onClick={() => setIsOpen(true)}>{__("edit-button")}</button>}
                    <button onClick={handleRemoveFromShelf}>{__("delete-button")}</button>
                </>}
            </div>
        </div>
    </RecordPreview >
    {/* <tr>
        <td>{recordDeleted ? <p><strong>[{__("Record does not exist")}]</strong></p> : <Link to={`/record/${record.record.id}`}>{record.record.title}</Link>}</td>
        <td>{isOpen
            ? <>
                <input value={note} onChange={e => setNote(e.target.value)} />
                <button onClick={handleEditNote}>{__("save-button")}</button>
                <button onClick={cancelEditing}>{__("cancel-button")}</button>
            </>
            : record.note}</td>
        <td>{canEdit && <>
            {recordDeleted ? <p></p> : <button onClick={() => setIsOpen(true)}>{__("edit-button")}</button>}
            <button onClick={handleRemoveFromShelf}>{__("delete-button")}</button>
        </>}</td>
    </tr>; */}
};

export default connect(
    state => ({
        __: __(state)
    }),
    { updateRecordInShelf, deleteRecordFromShelf }
)(ShelfRecord);