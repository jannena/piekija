import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/loantype`;

const getAll = token => {
    return axios.get(baseUrl, { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data);
};

const create = (name, canBePlacedAHold, canBeLoaned, canBeRenewed, renewTimes, loanTime, token) => {
    return axios.post(
        baseUrl,
        { name, canBePlacedAHold, canBeLoaned, canBeRenewed, renewTimes, loanTime },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data)
};

export default {
    getAll,
    create
};