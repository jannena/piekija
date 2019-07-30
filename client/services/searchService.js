import axios from "axios";

const baseUrl = "http://localhost:3001/api/search";

const simpleSearch = query => {
    return axios.post(`${baseUrl}/simple`, { query }).then(response => response.data);
};

const advancedSearch = query => {
    return axios.post(`${baseUrl}/advanced`, { query }).then(response => response.data);
};

export default {
    simpleSearch,
    advancedSearch
}