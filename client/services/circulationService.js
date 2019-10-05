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

export default {
    loan,
    returnItem,
    renew
};