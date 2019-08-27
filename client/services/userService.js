import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/user`;

const me = token => {
    return axios.get(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const updateMe = (data, token) => {
    return axios.put(
        `${baseUrl}/me`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    me,
    updateMe
};