import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/search`;

const search = (query, page, sort, advanced, filter) => {
    return axios.post(`${baseUrl}/${advanced ? "advanced" : "simple"}`, { query, page, sort, filter }).then(response => response.data);
};

export default {
    search
};