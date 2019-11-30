import React, { useEffect } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addItem, removeItem, updateItem } from "../../reducers/recordReducer";
import { getLocations } from "../../reducers/locationReducer";
import { getLoantypes } from "../../reducers/loantypeReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, FormSelect } from "../essentials/forms";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import __ from "../../langs";

const RecordItems = ({ items, locations, loantypes, addItem, removeItem, updateItem, getLocations, getLoantypes, __ }) => {
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

    const itemStateOptions = [
        [__("not in use"), "not in use"], [__("loaned"), "loaned"], [__("not loaned"), "not loaned"], [__("broken"), "broken"],
        [__("placed a hold"), __("placed a hold")], [__("other"), "other"]
    ];

    const form = data => <>
        <Form onSubmit={handleUpdateItem(data.id)}>
            <Input id={`${data.id}-barcode`} value={data.barcode} name="barcode" title={__("Barcode")} description={__("staff-item-barcode-info")} />
            <FormSelect id={`${data.id}-loantype`} selected={data.loantype ? data.loantype.id : ""} title={__("Loantype")} name="loantype" options={loantypes.map(loantype => [loantype.name, loantype.id])} />
            <FormSelect id={`${data.id}-location`} selected={data.location ? data.location.id : ""} title={__("Location")} name="location" options={locations.map(location => [location.name, location.id])} />
            {/* <Input id={`${data.id}-state`} value={data.state} name="state" title={__("State")} /> */}
            <FormSelect name="state" selected={data.state} title={__("State")} options={itemStateOptions} />
            <Input id={`${data.id}-note`} value={data.note} name="note" title={__("Note")} />
            <Button title={__("save-button")} />
        </Form>
        <Form onSubmit={handleRemoveItem(data.id)}>
            <Button title={__("delete-button")} />
        </Form>
    </>;


    return (
        <>
            <Expandable title={__("Create new item")}>
                <Form onSubmit={handleCreateItem}>
                    <Input name="barcode" title={__("Barcode")} description={__("staff-item-barcode-info")} />
                    <FormSelect name="loantype" title={__("Loantype")} options={loantypes.map(loantype => [loantype.name, loantype.id])} />
                    <FormSelect name="location" title={__("Location")} options={locations.map(location => [location.name, location.id])} />
                    <FormSelect name="state" title={__("State")} options={itemStateOptions} />
                    <Input name="note" title={__("Note")} />
                    <Button title={__("save-button")} />
                </Form>
            </Expandable>
            <Table widths={[25, 25, 25, 25]} titles={[__("Barcode"), __("Loantype"), __("Location"), __("State")]} data={items} form={form}>
                {items.map(i => <TableRow key={i.id}>
                    <TableCell>{i.barcode}</TableCell>
                    <TableCell>{i.loantype && i.loantype.name}</TableCell>
                    <TableCell>{i.location && i.location.name}</TableCell>
                    <TableCell>{__(i.state)}</TableCell>
                </TableRow>)}
            </Table>
        </>
    );
};

export default connect(
    state => ({
        items: state.record.record.result ? state.record.record.result.items : null,
        locations: state.location,
        loantypes: state.loantype,
        __: __(state)
    }),
    { addItem, getLoantypes, getLocations, removeItem, updateItem }
)(RecordItems);