import axios from "axios";

const baseUrl = "http://localhost:3001/api/search";

const search = (query, page, sort, advanced) => {
    return axios.post(`${baseUrl}/${advanced ? "advanced" : "simple"}`, { query, page }).then(response => response.data);
};

export default {
    search
};