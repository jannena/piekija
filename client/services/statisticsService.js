import axios from "axios";
import { baseUrl as b } from "../globals";

const baseUrl = `${b}/statistics`;

const total = token => {
    return axios.post(
        `${baseUrl}/total`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const totalLoans = (token) => {
    return axios.post(
        `${baseUrl}/totalLoans`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

const notLoanedSince = (location, shelfLocation, date, language, token) => {
    return axios.post(
        `${baseUrl}/notLoanedSince`,
        { location, shelfLocation, date, language },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
};

export default { total, totalLoans, notLoanedSince, };