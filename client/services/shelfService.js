import axios from "axios";

const baseUrl = "http://localhost:3001/api/shelf";

const get = (id, token) => {
    return axios.get(`${baseUrl}/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}).then(response => response.data);
};

export default {
    get
};