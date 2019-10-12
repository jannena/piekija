import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllNotes, createNote, updateNote } from "../../reducers/noteReducer";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import Expandable from "../essentials/Expandable";

const StaffNotes = ({ notes, getAllNotes, createNote, updateNote }) => {
    useEffect(() => {
        getAllNotes();
    }, []);

    const saveNote = id => e => {
        e.preventDefault();
        const { title, content } = e.target;
        updateNote(id, title.value, content.value);
    };

    const form = data => <div>
        <form onSubmit={saveNote(data.id)}>
            <input name="title" defaultValue={data.title} />
            <textarea name="content" defaultValue={data.content} />
            <button>Save</button>
        </form>
        <button>Remove</button>
    </div>;

    return (<>
        <div>Notes</div>
        <Expandable title="Create new note">
            <form onSubmit={e => e.preventDefault()}>
                <input />
                <textarea />
                <button>Create note</button>
            </form>
        </Expandable>
        <Table widths={[75]} colors={["#dcdcdc", "#f5f5f5"]} form={form} data={notes}>
            {notes.map(n => <TableRow>
                <TableCell>{n.title}</TableCell>
            </TableRow>)}
        </Table>
    </>);
};

export default connect(
    state => ({
        notes: state.notes
    }),
    { getAllNotes, createNote, updateNote }
)(StaffNotes);