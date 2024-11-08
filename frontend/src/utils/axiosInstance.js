import axios from "axios";
import { BASE_URL } from "./constatnts";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const acccessToken = localStorage.getItem("token");
    if (acccessToken) {
      config.headers.Authorization = `Bearer ${acccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
