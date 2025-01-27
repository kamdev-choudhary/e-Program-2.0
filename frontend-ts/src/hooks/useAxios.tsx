import axios from "axios";
import useHandleResponse from "./useHandleResponse";
import { API_URL } from "../config/environment";

const useAxios = () => {
  const { handleResponse } = useHandleResponse();

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      const deviceId = localStorage.getItem("deviceId");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add token to headers
      }
      if (deviceId) {
        config.headers.deviceid = deviceId; // Add deviceId to headers
      }

      return config;
    },
    (error) => {
      return Promise.reject(error); // Reject promise for request errors
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      handleResponse(response); // Handle successful responses
      return response; // Return response for further processing
    },
    (error) => {
      if (error.response) {
        handleResponse(error.response); // Handle server-side errors
        if (error.response.status === 401) {
          localStorage.clear();
          // Trigger logout notification using your notification system
          alert("Session expired. Please log in again."); // Replace with a notification/toast system
          window.location.href = "/login"; // Redirect to login page
        }
      } else {
        // Handle network or unknown errors
        handleResponse({
          status: 0,
          data: { message: "Network error or server not reachable." },
        });
      }

      return Promise.reject(error); // Reject promise for error handling
    }
  );

  return axiosInstance; // Return the configured Axios instance
};

export default useAxios;
