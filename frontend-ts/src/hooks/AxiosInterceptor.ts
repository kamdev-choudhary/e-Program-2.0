import axios from "axios";
import { API_URL } from "../config/config";
import { LS_KEYS } from "../constant/constants";

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    const deviceId = localStorage.getItem(LS_KEYS.DEVICE_ID);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (deviceId) {
      config.headers.deviceid = deviceId; // Add the deviceId to the headers
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
    if (error?.response?.status === 401) {
      localStorage.clear();
      localStorage.setItem(LS_KEYS.LOGOUT, "Session Expired. Logged out.");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default instance;
