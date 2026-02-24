import axios from "axios";
import { baseURL } from "../common/SummaryApi";

const AxiosAgent = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

AxiosAgent.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("agent_accesstoken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default AxiosAgent;
