import axios from 'axios';
const axiosURL = axios.create({baseURL: 'http://localhost:3000/'});
export default axiosURL;