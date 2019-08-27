import axios from "axios";

const baseUrl = "https://localhost:3001/api/search";

const search = (query, page, sort, advanced) => {
    return axios.post(`${baseUrl}/${advanced ? "advanced" : "simple"}`, { query, page }).then(response => response.data);
};

export default {
    search
};