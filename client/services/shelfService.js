import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/shelf`;

const get = (shelfId, token) => {
    return axios.get(
        `${baseUrl}/${shelfId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    ).then(response => response.data);
};

const create = (name, description, publicity, token) => {
    return axios.post(
        baseUrl,
        {
            name,
            public: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const update = (id, name, description, publicity, token) => {
    console.log("Updating shelf!!!!!", name, description, publicity)
    return axios.put(
        `${baseUrl}/${id}`,
        {
            name,
            description,
            public: publicity
        },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const addRecord = (shelfId, recordId, token) => {
    return axios.post(
        `${baseUrl}/${shelfId}/shelve`,
        { record: recordId },
        { headers: { Authorization: `Bearer ${token}` } }
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

const share = (shelfId, username, token) => {
    return axios.post(
        `${baseUrl}/${shelfId}/share`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const unshare = (shelfId, username, token) => {
    return axios.delete(
        `${baseUrl}/${shelfId}/share`,
        {
            headers: { Authorization: `Bearer ${token}` },
            data: { username }
        }
    ).then(response => response.data);
};

export default {
    get,
    create,
    update,
    addRecord,
    editRecord,
    removeRecord,
    share,
    unshare
};