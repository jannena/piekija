import axios from "axios";
import { baseUrl as b } from "../globals"

const baseUrl = `${b}/item`;

const addItem = (record, loantype, location, state, note, token) => {
    return axios.post(
        baseUrl,
        {
            record,
            loantype,
            location,
            state,
            note
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    addItem
};