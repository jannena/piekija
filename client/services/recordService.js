import axios from "axios";

const baseUrl = "http://localhost:3001/api/record";

const get = id => {
    return axios.get(`${baseUrl}/${id}`).then(response => response.data);
};

const updateMARC = (id, newMARC, token) => {
    return axios.put(
        `${baseUrl}/${id}`,
        {
            type: "marc21",
            data: newMARC
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data)
};

export default {
    get,
    updateMARC
};