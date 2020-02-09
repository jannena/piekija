import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/user`;

const me = token => {
    return axios.get(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const getLoanHistory = token => {
    return axios.get(`${baseUrl}/me/loanhistory`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const updateMe = (data, token) => {
    return axios.put(
        `${baseUrl}/me`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const search = (query, token) => {
    return axios.post(
        `${baseUrl}/search`,
        query,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const create = token => {
    return axios.post(
        baseUrl,
        {
            name: "New patreon",
            username: new Date().toUTCString(),
            password: "1234567890",
            staff: false,
            barcode: new Date().toUTCString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const update = (userId, name, username, barcode, password, address = null, email = null, phone = null, token) => {
    return axios.put(
        `${baseUrl}/${userId}`,
        { name, username, barcode, password },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    me,
    getLoanHistory,
    updateMe,
    search,
    create,
    update
};