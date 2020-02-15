import axios from "axios";
import { baseUrl as b } from "../globals"

const baseUrl = `${b}/circulation`;

const loan = (itemId, userId, token) => {
    return axios.post(
        `${baseUrl}/loan`,
        { item: itemId, user: userId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const returnItem = (itemId, token) => {
    return axios.post(
        `${baseUrl}/return`,
        { item: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const renew = (itemId, token) => {
    return axios.post(
        `${baseUrl}/renew`,
        { item: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const placeAHold = (record, location, token) => {
    return axios.post(
        `${baseUrl}/hold`,
        { record, location },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const removeAHold = (record, token) => {
    return axios.delete(
        `${baseUrl}/hold`,
        {
            headers: { Authorization: `Bearer ${token}` },
            data: { record, location: "coming soon" }
        }
    ).then(response => response.data);
};

export default {
    loan,
    returnItem,
    renew,
    placeAHold,
    removeAHold
};