import React, { useState } from "react";
import { connect } from "react-redux";
import Select from "../Select";
import { updateItem, removeItem } from "../../reducers/recordReducer";

const RecordItem = ({ item, loantypes, locations, updateItem, removeItem }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [location, setLocation] = useState(item.location.id);
    const [loantype, setLoantype] = useState(item.loantype.id);
    const [state, setState] = useState(item.state);
    const [note, setNote] = useState(item.note);

    // TODO: ??This might be duplicating!??
    const saveItem = e => {
        e.preventDefault();
        setIsOpen(false);
        updateItem(item.id, loantype, location, state, note);
    };

    const deleteItem = () => {
        removeItem(item.id);
    };

    if (isOpen) return <tr>
        <td>{item.barcode}</td>
        <td><Select selected={item.loantype.id} onChange={e => setLoantype(e.target.value)} options={loantypes.map(loantype => [loantype.name, loantype.id])} /></td>
        <td><Select selected={item.location.id} onChange={e => setLocation(e.target.value)} options={locations.map(location => [location.name, location.id])} /></td>
        <td><input value={state} onChange={e => setState(e.target.value)} /></td>
        <td><textarea value={note} onChange={e => setNote(e.target.value)} /></td>
        <td>
            <button onClick={saveItem}>Save</button>
            <button onClick={deleteItem}>Remove</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
        </td>
    </tr>;

    else return <tr>
        <td>{item.barcode}</td>
        <td>{item.loantype.name}</td>
        <td>{item.location.name}</td>
        <td>{item.state}</td>
        <td>{item.note}</td>
        <td><button onClick={() => setIsOpen(true)}>Edit</button></td>
    </tr>;
};

export default connect(
    state => ({
        loantypes: state.loantype,
        locations: state.location
    }),
    { updateItem, removeItem }
)(RecordItem);