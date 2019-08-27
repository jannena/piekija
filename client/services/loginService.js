import axios from "axios";

const baseUrl = "https://localhost:3001/api/login";

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