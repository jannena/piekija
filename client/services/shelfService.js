import axios from "axios";

const baseUrl = "http://localhost:3001/api/shelf";

const get = (shelfId, token) => {
    return axios.get(
        `${baseUrl}/${shelfId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    ).then(response => response.data);
};

const editRecord = (shelfId, recordId, note, token) => {
    return axios.put(
        `${baseUrl}/${shelfId}/shelve`,
        { record: recordId, note },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const removeRecord = (shelfId, recordId, token) => {
    return axios.delete(
        `${baseUrl}/${shelfId}/shelve`,
        {
            headers: { Authorization: `Bearer ${token}` },
            data: { record: recordId }
        }
    ).then(response => response.data);
};

export default {
    get,
    editRecord,
    removeRecord
};