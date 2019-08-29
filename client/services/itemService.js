import axios from "axios";
import { baseUrl as b } from "../globals"

const baseUrl = `${b}/item`;

const addItem = (record, loantype, location, state, note, token) => {
    axios.post(
        baseUrl,
        {
            record,
            loantype,
            location,
            state,
            note
        },
        { headers: { Authorization: `Bearer ${token}` } }
    )
};

export default {
    addItem
};