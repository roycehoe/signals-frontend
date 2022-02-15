import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { baseURL } from "@/services/config";


export const client: AxiosInstance = axios.create({
    baseURL: baseURL,
} as AxiosRequestConfig)


client.interceptors.request.use(function (config: AxiosRequestConfig) {
    config.headers = {token : localStorage.getItem("token") || ""}
    return config;
})
