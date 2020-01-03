import axios from "axios";
import { baseUrl as b } from "../globals"

const baseUrl = `${b}/item`;

const addItem = (barcode, record, loantype, location, state, note, shelfLocation, token) => {
    return axios.post(
        baseUrl,
        {
            barcode,
            record,
            loantype,
            location,
            state,
            note,
            shelfLocation
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const updateItem = (itemId, loantype, location, state, note, shelfLocation, token) => {
    return axios.put(
        `${baseUrl}/${itemId}`,
        {
            loantype,
            location,
            state,
            note,
            shelfLocation
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const removeItem = (itemId, token) => {
    return axios.delete(
        `${baseUrl}/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const search = (barcode, token) => {
    return axios.post(
        `${baseUrl}/search`,
        { barcode },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    addItem,
    updateItem,
    removeItem,
    search
};