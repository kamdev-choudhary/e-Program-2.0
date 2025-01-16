import axios from "axios";
import { API_URL } from "../config/environment";

const instance = axios.create({
  baseURL: API_URL,
  //timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized or token expired");
    }
    return Promise.reject(error);
  }
);

export default instance;
