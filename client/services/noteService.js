import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/note`;

const getLast = () => {
    return axios.get(`${baseUrl}/last`).then(response => response.data);
};

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

const create = (title, content, token) => {
    return axios
        .post(
            baseUrl,
            { title, content },
            { headers: { Authorization: `Bearer ${token}` } }
        )
    .then(response => response.data);
};

export default {
    getLast,
    getAll,
    create
};