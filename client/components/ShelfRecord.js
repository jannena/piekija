import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteRecordFromShelf, updateRecordInShelf } from "../reducers/shelfReducer";

const ShelfRecord = ({ state, record, canEdit, updateRecordInShelf, deleteRecordFromShelf }) => {
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

    return <tr>
        <td><Link to={`/record/${record.record.id}`}>{record.record.title}</Link></td>
        <td>{isOpen
            ? <>
                <input value={note} onChange={e => setNote(e.target.value)} />
                <button onClick={handleEditNote}>save</button>
                <button onClick={cancelEditing}>cancel</button>
            </>
            : record.note}</td>
        <td>{canEdit && <>
            <button onClick={() => setIsOpen(true)}>edit note</button>
            <button onClick={handleRemoveFromShelf}>delete from shelf</button>
        </>}</td>
    </tr>;
};

export default connect(
    state => ({ state }),
    { updateRecordInShelf, deleteRecordFromShelf }
)(ShelfRecord);