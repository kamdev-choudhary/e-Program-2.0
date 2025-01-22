import axios from "axios";
import { API_URL } from "../config/environment";
import toastService from "../utils/toastService";

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
      toastService({
        message: "Token expired or invalid Tokens. Logggin out....",
        duration: 300,
        position: "top-center",
      });
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default instance;
