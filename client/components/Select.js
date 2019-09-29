import React from "react";

/*
 * props:
 * - options: String[2][]
 *     [
 *         ["text to show on screen", "unique value for value attribute"],
 *         ["I want a yellow car", "yellow"],
 *         ["I want a red car", "red"]
 *     ]
 * 
*/
const Select = ({ options, selected, defaultSelected, onChange, name }) => {
    return (
        <select name={name} onChange={onChange} defaultValue={defaultSelected} value={selected}>
            {options.map(o => <option key={o[1]} value={o[1]}>{o[0]}</option>)}
        </select>
    );
};

export default Select;