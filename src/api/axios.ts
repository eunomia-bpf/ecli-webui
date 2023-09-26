import axios from 'axios'

export const axiosBaseURL = 'http://localhost:5173/api';

const axiosInstance = axios.create({
    baseURL: axiosBaseURL,
    timeout: 5000,
})
export default axiosInstance
