import React, { useState } from "react";
import { Link } from "react-router-dom";
import shelfService from "../services/shelfService";

const ShelfRecord = ({ shelfId, record, canEdit, token }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [note, setNote] = useState(record.note || "");

    const handleEditNote = () => {
        console.log(token);
        shelfService
            .editRecord(shelfId, record.record.id, note, token)
            .then(result => {
                console.log("edited record (in shelf)", result);
                setIsOpen(false);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleRemoveFromShelf = () => {
        shelfService
            .removeRecord(shelfId, record.record.id, token)
            .then(result => {
                // TODO: Remove deleted record from screen
                console.log("removed record from shelf", result);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const cancelEdition = () => {
        setIsOpen(false);
        setNote(record.note || "");
    };

    return <tr>
        <td><Link to={`/record/${record.record.id}`}>{record.record.title}</Link></td>
        <td>{isOpen
            ? <>
                <input value={note} onChange={e => setNote(e.target.value)} />
                <button onClick={handleEditNote}>save</button>
                <button onClick={cancelEdition}>cancel</button>
            </>
            : note}</td>
        <td>{canEdit && <>
            <button onClick={() => setIsOpen(true)}>edit note</button>
            <button onClick={handleRemoveFromShelf}>delete from shelf</button>
        </>}</td>
    </tr>;
};

export default ShelfRecord;