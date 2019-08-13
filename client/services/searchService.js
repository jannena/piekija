import axios from "axios";

const baseUrl = "http://localhost:3001/api/search";

const simpleSearch = (query, page) => {
    return axios.post(`${baseUrl}/simple`, { query, page }).then(response => response.data);
};

const advancedSearch = (query, page) => {
    return axios.post(`${baseUrl}/advanced`, { query, page }).then(response => response.data);
};

export default {
    simpleSearch,
    advancedSearch
}