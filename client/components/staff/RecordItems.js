import React, { useEffect } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addItem } from "../../reducers/recordReducer";
import { getLocations } from "../../reducers/locationReducer";
import { getLoantypes } from "../../reducers/loantypeReducer";

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

    return (
        <>
            <div>
                <form onSubmit={handleCreateItem}>
                    <input name="barcode" placeholder="barcode" />
                    <Select name="loantype" options={loantypes.map(loantype => [loantype.name, loantype._id])} />
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
                        <th>location</th>
                        <th>state</th>
                        <th>note</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item =>
                        <tr key={item._id}>
                            <td>{item.barcode}</td>
                            <td>{item.location.name}</td>
                            <td>{item.state}</td>
                            <td>{item.note}</td>
                        </tr>
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