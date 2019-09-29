import React, { useEffect } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addItem } from "../../reducers/recordReducer";
import { getLocations } from "../../reducers/locationReducer";
import { getLoantypes } from "../../reducers/loantypeReducer";
import RecordItem from "./RecordItem";

const RecordItems = ({ items, locations, loantypes, addItem, getLocations, getLoantypes }) => {
    useEffect(() => {
        if (items && locations.length === 0) getLocations();
        if (items && loantypes.length === 0) getLoantypes();
    }, [locations, loantypes, items]);

    if (!items) return <p>Items are not available in preview</p>

    console.log("record items", items);

    const handleCreateItem = e => {
        e.preventDefault();
        const { barcode, loantype, location, state, note } = e.target;
        addItem(loantype.value, location.value, state.value, note.value, barcode.value);
    };

    // TODO: Replace table with styled divs for better item editing
    return (
        <>
            <div>
                <form onSubmit={handleCreateItem}>
                    <input name="barcode" placeholder="barcode" />
                    <Select name="loantype" options={loantypes.map(loantype => [loantype.name, loantype.id])} />
                    <Select name="location" options={locations.map(location => [location.name, location.id])} />
                    <input placeholder="state" name="state" />
                    <input placeholder="note" name="note" />
                    <button>Create item</button>
                </form>
            </div>
            <button>Add item</button>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>barcode</th>
                        <th>loantype</th>
                        <th>location</th>
                        <th>state</th>
                        <th>note</th>
                        <th>tools</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item =>
                        <RecordItem key={item.id} item={item} />
                    )}
                </tbody>
            </table>
        </>
    );
};

export default connect(
    state => ({
        items: state.record.record.result ? state.record.record.result.items : null,
        locations: state.location,
        loantypes: state.loantype
    }),
    { addItem, getLoantypes, getLocations }
)(RecordItems);