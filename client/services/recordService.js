import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/record`;

const get = id => {
    return axios.get(`${baseUrl}/${id}`).then(response => response.data);
};

const createWithMARC = (recordMARC, ai, token) => {
    return axios
        .post(
            baseUrl,
            {
                type: "marc21",
                data: recordMARC,
                ai
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(response => response.data);
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

const remove = (id, token) => {
    return axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const review = (score, review, record, isPublic, token) => {
    return axios.post(
        `${baseUrl}/${record}/review`,
        { score, review, public: isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const removeReview = (record, review, token) => {
    return axios.delete(
        `${baseUrl}/${record}/review/${review}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    get,
    remove,
    createWithMARC,
    updateMARC,

    review,
    removeReview
};