import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllNotes, createNote, updateNote, removeNote } from "../../reducers/noteReducer";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, Textarea } from "../essentials/forms";
import __ from "../../langs";

const StaffNotes = ({ notes, getAllNotes, createNote, updateNote, removeNote, __ }) => {
    useEffect(() => {
        getAllNotes();
    }, []);

    const handleUpdateNote = id => e => {
        const { title, content } = e.target;
        updateNote(id, title.value, content.value);
    };


    const handleCreateNote = e => {
        const { title, content } = e.target;
        createNote(title.value, content.value);
    };

    const handleRemoveNote = id => e => {
        removeNote(id);
    };

    const form = data => <>
        <Form onSubmit={handleUpdateNote(data.id)}>
            <Input id={`${data.id}-title`} name="title" title={__("Title")} description="" value={data.title} />
            <Textarea id={`${data.id}-content`} name="content" title={__("Content")} description="" value={data.content} />
            <Button className="note-save-button" title={__("save-button")} />
        </Form>
        <Form onSubmit={handleRemoveNote(data.id)}>
            <Button className="note-remove-button" title={__("remove-button")}></Button>
        </Form>
    </>;

    return (<>
        <Expandable title={__("Create new note")}>
            <Form onSubmit={handleCreateNote}>
                <Input title={__("Title")} name="title" description="" />
                <Textarea title={__("Content")} name="content" description="" />
                <Button title={__("create-button")} />
            </Form>
        </Expandable>
        <Table titles={[__("Title")]} widths={[100]} colors={["#dcdcdc", "#f5f5f5"]} form={form} data={notes}>
            {notes.map(n => <TableRow>
                <TableCell>{n.title}</TableCell>
            </TableRow>)}
        </Table>
    </>);
};

export default connect(
    state => ({
        notes: state.notes,
        __: __(state)
    }),
    { getAllNotes, createNote, updateNote, removeNote }
)(StaffNotes);