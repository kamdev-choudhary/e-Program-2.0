import axios from "axios";
import { API_URL } from "../config/config";
import { LS_KEYS } from "../constant/constants";

// Create the main axios instance with interceptors.
const instance = axios.create({
  baseURL: API_URL,
});

// Create a separate axios instance without interceptors for refreshing the token.
const refreshInstance = axios.create({
  baseURL: API_URL,
});

// Flag to indicate if a refresh token request is already in progress.
let isRefreshing = false;
// Queue to hold pending requests while token is being refreshed.
let failedQueue: any = [];

// Function to process the queue once the refresh is done.
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: attach access token and device id (if available)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    const deviceId = localStorage.getItem(LS_KEYS.DEVICE_ID);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (deviceId) {
      config.headers.deviceid = deviceId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors by attempting to refresh the token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and the request hasn't been retried yet:
    if (error?.response?.status === 401 && !originalRequest._retry) {
      // Avoid retrying the refresh request itself
      if (originalRequest.url.includes("/auth/token/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If a refresh is already in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Update the authorization header and retry the original request
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark that the refresh process has started
      isRefreshing = true;
      const refreshToken = localStorage.getItem(LS_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          // Make the refresh token request using the separate axios instance
          const { data } = await refreshInstance.post(
            "/auth/token/refresh",
            null,
            { headers: { "x-refresh-token": refreshToken } }
          );
          const newAccessToken = data.accessToken;
          // Update local storage and axios defaults with the new token
          localStorage.setItem(LS_KEYS.TOKEN, newAccessToken);
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Process the queued requests
          processQueue(null, newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, process the queue with an error, clear local storage, and logout.
          processQueue(refreshError, null);
          console.error("Refresh token error:", refreshError);
          localStorage.clear();
          localStorage.setItem(LS_KEYS.LOGOUT, "Session Expired. Logged out.");
          window.location.reload();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available; log the user out.
        localStorage.clear();
        localStorage.setItem(LS_KEYS.LOGOUT, "Session Expired. Logged out.");
        window.location.reload();
        return Promise.reject(error);
      }
    }

    // For other errors, reject the promise.
    return Promise.reject(error);
  }
);

export default instance;
