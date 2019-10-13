import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllNotes, createNote, updateNote } from "../../reducers/noteReducer";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, Textarea } from "../essentials/forms";

const StaffNotes = ({ notes, getAllNotes, createNote, updateNote }) => {
    useEffect(() => {
        getAllNotes();
    }, []);

    const handleUpdateNote = id => e => {
        e.preventDefault();
        const { title, content } = e.target;
        updateNote(id, title.value, content.value);
    };

    const form = data => <Form onSubmit={handleUpdateNote(data.id)}>
        <Input id={`${data.id}-title`} name="title" title="Title" description="" value={data.title} />
        <Textarea id={`${data.id}-content`} name="content" title="Content" description="" value={data.content} />
        <Button title="Save" />
    </Form>;

    return (<>
        <div>Notes</div>
        <Expandable title="Create new note">
            <Form onSubmit={e => e.preventDefault()}>
                <Input title="Title" name="title" description="Write the title of the note here." />
                <Textarea title="Content" name="content" description="Write the content of the note here." />
                <Button title="Save" />
            </Form>
        </Expandable>
        <Table titles={["Note title"]} widths={[100]} colors={["#dcdcdc", "#f5f5f5"]} form={form} data={notes}>
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