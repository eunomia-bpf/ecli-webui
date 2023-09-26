import { DefaultApi } from '@/api-client'
import axiosInstance from './axios'


export const ecliApi = new DefaultApi(undefined, undefined, axiosInstance)
