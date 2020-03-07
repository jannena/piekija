import React, { useEffect } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addItem, removeItem, updateItem } from "../../reducers/recordReducer";
import { getLoantypes } from "../../reducers/loantypeReducer";
import Expandable from "../essentials/Expandable";
import { Form, Input, Button, FormSelect, Text, Grid, DoNotSendButton } from "../essentials/forms";
import { Table, TableRow, TableCell } from "../essentials/Tables";
import __ from "../../langs";
import { withRouter } from "react-router-dom";
import { searchForItem } from "../../reducers/circulationReducer";

const RecordItems = ({ record, items, locations, loantypes, addItem, removeItem, updateItem, getLoantypes, searchForItem, history, __ }) => {
    useEffect(() => {
        if (items && loantypes.length === 0) getLoantypes();
    }, [locations, loantypes, items]);

    if (!items) return <p>{__("Items are not available in preview")}</p>

    console.log("record items", items);

    const handleCreateItem = e => {
        const { barcode, loantype, location, state, note, shelfLocation } = e.target;
        addItem(loantype.value, location.value, state.value, note.value, barcode.value, shelfLocation.value);
    };

    const handleUpdateItem = id => e => {
        const { loantype, location, state, note, shelfLocation } = e.target;
        updateItem(id, loantype.value, location.value, state.value, note.value, shelfLocation.value);
    };

    const handleRemoveItem = id => e => {
        removeItem(id);
    };

    const handleMoveToItem = barcode => e => {
        searchForItem(barcode);
        history.push("/staff/circulation");
    };

    const itemStateOptions = [
        [__("not loaned"), "not loaned"], [__("not in use"), "not in use"], [__("loaned"), "loaned"], [__("broken"), "broken"],
        [__("placed a hold"), "placed a hold"], [__("being carried"), "being carried"], [__("pick-up"), "pick-up"], [__("other"), "other"]
    ];

    const form = data => <>
        <Form onSubmit={handleUpdateItem(data.id)}>
            <Text title={__("Last loaned")} value={`${__("date-format")(new Date(data.lastLoaned))} ${__("time-format")(new Date(data.lastLoaned))}`} />
            <Text title={__("Loan times")} value={data.loanTimes || 0} />
            <hr />
            <Text id={`${data.id}-barcode`} value={<a href="#" onClick={handleMoveToItem(data.barcode)}>{data.barcode}</a>} name="barcode" title={__("Barcode")} description={__("staff-item-barcode-info")} />
            <FormSelect id={`${data.id}-loantype`} selected={data.loantype ? data.loantype.id : ""} title={__("Loantype")} name="loantype" options={loantypes.map(loantype => [loantype.name, loantype.id])} />
            <FormSelect className="edit-location" id={`${data.id}-location`} selected={data.location ? data.location.id : ""} title={__("Location")} name="location" options={locations.map(location => [location.name, location.id])} />
            <Input className="edit-shelfLocation" id={`${data.id}-shelfLocation`} value={data.shelfLocation} name="shelfLocation" title={__("Shelf location")} description={__("staff-item-shelf-location-info")} />
            {/* <Input id={`${data.id}-state`} value={data.state} name="state" title={__("State")} /> */}
            <FormSelect className="edit-state" name="state" selected={data.state} title={__("State")} options={itemStateOptions} description={__("staff-item-state-info")} />
            <Input className="edit-note" id={`${data.id}-note`} value={data.note} name="note" title={__("Note")} />
            <Grid>
                <DoNotSendButton className="remove-item-button" onClick={handleRemoveItem(data.id)} title={__("delete-button")} />
                <Button className="save-item-button" title={__("save-button")} />
            </Grid>
        </Form>
    </>;


    return (
        <>
            <Expandable title={__("Create new item")}>
                <Form onSubmit={handleCreateItem}>
                    <Input name="barcode" value={record.result.ai ? `${record.result.ai}/${items.length + 1}` : ""} title={__("Barcode")} description={__("staff-item-barcode-info")} />
                    <FormSelect name="loantype" title={__("Loantype")} options={loantypes.map(loantype => [loantype.name, loantype.id])} />
                    <FormSelect name="location" title={__("Location")} options={locations.map(location => [location.name, location.id])} />
                    <Input name="shelfLocation" value="-" title={__("Shelf location")} description={__("staff-item-shelf-location-info")} />
                    <FormSelect name="state" title={__("State")} options={itemStateOptions} description={__("staff-item-state-info")} />
                    <Input name="note" title={__("Note")} />
                    <Button className="create-item-button" title={__("save-button")} />
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
        record: state.record.record,
        items: state.record.record.result ? state.record.record.result.items : null,
        locations: state.location,
        loantypes: state.loantype,
        __: __(state)
    }),
    { addItem, getLoantypes, removeItem, updateItem, searchForItem }
)(withRouter(RecordItems));