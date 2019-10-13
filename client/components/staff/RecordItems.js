import React, { useEffect } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addItem, removeItem, updateItem } from "../../reducers/recordReducer";
import { getLocations } from "../../reducers/locationReducer";
import { getLoantypes } from "../../reducers/loantypeReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, FormSelect } from "../essentials/forms";
import { Table, TableRow, TableCell } from "../essentials/Tables";

const RecordItems = ({ items, locations, loantypes, addItem, removeItem, updateItem, getLocations, getLoantypes }) => {
    useEffect(() => {
        if (items && locations.length === 0) getLocations();
        if (items && loantypes.length === 0) getLoantypes();
    }, [locations, loantypes, items]);

    if (!items) return <p>Items are not available in preview</p>

    console.log("record items", items);

    const handleCreateItem = e => {
        const { barcode, loantype, location, state, note } = e.target;
        addItem(loantype.value, location.value, state.value, note.value, barcode.value);
    };

    const handleUpdateItem = id => e => {
        const { barcode, loantype, location, state, note } = e.target;
        updateItem(id, loantype.value, location.value, state.value, note.value);
    };

    const handleRemoveItem = id => e => {
        removeItem(id);
    };

    const form = data => <>
        <Form onSubmit={handleUpdateItem(data.id)}>
            <Input id={`${data.id}-barcode`} value={data.barcode} name="barcode" title="Barcode" description="Unique code for every item" />
            <FormSelect id={`${data.id}-loantype`} selected={data.loantype.id} title="Loantype" name="loantype" options={loantypes.map(loantype => [loantype.name, loantype.id])} />
            <FormSelect id={`${data.id}-location`} selected={data.location.id} title="Location" name="location" options={locations.map(location => [location.name, location.id])} />
            <Input id={`${data.id}-state`} value={data.state} name="state" title="State" />
            <Input id={`${data.id}-note`} value={data.note} name="note" title="Note" />
            <Button title="Create item" />
        </Form>
        <Form onSubmit={handleRemoveItem(data.id)}>
            <Button title="Remove" />
        </Form>
    </>;


    return (
        <>
            <Expandable title="Create new item">
                <Form onSubmit={handleCreateItem}>
                    <Input name="barcode" title="Barcode" description="Unique code for every item" />
                    <Select name="loantype" options={loantypes.map(loantype => [loantype.name, loantype.id])} />
                    <Select name="location" options={locations.map(location => [location.name, location.id])} />
                    <Input name="state" title="State" />
                    <Input name="note" title="Note" />
                    <Button title="Create item" />
                </Form>
            </Expandable>
            <Table widths={[25, 25, 25, 25]} titles={["Barcode", "Loantype", "Location", "State"]} data={items} form={form}>
                {items.map(i => <TableRow key={i.id}>
                    <TableCell>{i.barcode}</TableCell>
                    <TableCell>{i.loantype && i.loantype.name}</TableCell>
                    <TableCell>{i.location && i.location.name}</TableCell>
                    <TableCell>{i.state}</TableCell>
                </TableRow>)}
            </Table>
        </>
    );
};

export default connect(
    state => ({
        items: state.record.record.result ? state.record.record.result.items : null,
        locations: state.location,
        loantypes: state.loantype
    }),
    { addItem, getLoantypes, getLocations, removeItem, updateItem }
)(RecordItems);