import React, { useState } from "react";
import { connect } from "react-redux";
import { updateLocation, removeLocation } from "../../reducers/locationReducer";

// TODO: That kind of code is now in many places. Come up with a general solutions for this problem.

const StaffLocation = ({ location, updateLocation, removeLocation }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState(location.name);

    const saveLocation = e => {
        updateLocation(location.id, name);
        setIsOpen(false);
    };

    if (isOpen) return <tr>
        <td><input value={name} onChange={e => setName(e.target.value)} /></td>
        <td>
            <button onClick={saveLocation}>save</button>
            <button onClick={() => removeLocation(location.id)}>remove</button>
            <button onClick={() => setIsOpen(false)}>cancel</button>
        </td>
    </tr>

    else return <tr>
        <td>{location.name}</td>
        <td><button onClick={() => setIsOpen(true)}>edit</button></td>
    </tr>
};

export default connect(
    null,
    { updateLocation, removeLocation }
)(StaffLocation);