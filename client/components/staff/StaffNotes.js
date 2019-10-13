import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllNotes, createNote, updateNote } from "../../reducers/noteReducer";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button } from "../essentials/forms";

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
            <Form onSubmit={e => e.preventDefault()}>
                <Input title="Title" name="title" description="Write the title of the note here." />
                <Input type="textarea" title="Content" name="content" description="Write the content of the note here." />
                <Button title="Save" />
            </Form>
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