import axios from "axios";

const baseUrl = "http://localhost:3001/api/record";

const get = id => {
    return axios.get(`${baseUrl}/${id}`).then(response => response.data);
};

export default  {
    get
};