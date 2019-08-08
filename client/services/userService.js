import axios from "axios";

const baseUrl = "http://localhost:3001/api/user";

const me = token => {
    return axios.get(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

export default {
    me
};