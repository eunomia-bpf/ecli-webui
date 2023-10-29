import axios from 'axios'

export const axiosBaseURL = 'http://localhost:5173/api';

const axiosInstance = axios.create({
    baseURL: axiosBaseURL,
    timeout: 10000,
})
export default axiosInstance
