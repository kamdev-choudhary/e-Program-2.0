import axios from "axios";
import { apiUrl } from "../config/environment";

const instance = axios.create({
  baseURL: apiUrl, // Replace with your backend URL
  //   timeout: 10000, // Set timeout as needed
});

instance.interceptors.request.use(
  (config) => {
    const token = "sushmukD";
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
