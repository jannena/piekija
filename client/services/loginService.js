import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/login`;

// Code is used with 2-factor authentication as 2-factor authentication code
const login = (username, password, code) => {
    const data = {
        username,
        password,
        code
    };
    return axios.post(baseUrl, data).then(response => response.data);
};

export default {
    login
};