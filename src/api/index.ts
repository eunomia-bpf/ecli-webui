import { DefaultApi } from '@/api-client'
import axiosInstance from './axios'
import { axiosBaseURL } from './axios'
import axios from 'axios'


export const ecliApi = new DefaultApi({
    basePath: axiosBaseURL,
    isJsonMime: () => false,
}, undefined, axiosInstance)
