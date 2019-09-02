import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/location`;

const getAll = token => {
    return axios.get(baseUrl, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const create = (name, token) => {
    return axios.post(
        baseUrl,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data)
};

export default {
    getAll,
    create
};