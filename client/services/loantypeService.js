import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/loantype`;

const getAll = token => {
    return axios.get(baseUrl, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const create = (name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime, token) => {
    return axios.post(
        baseUrl,
        { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data)
};

const remove = (id, token) => {
    return axios.delete(
        `${baseUrl}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const update = (id, name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime, token) => {
    return axios.put(
        `${baseUrl}/${id}`,
        { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime, token },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default {
    getAll,
    create,
    remove,
    update
};