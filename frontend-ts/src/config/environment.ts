export const mode = import.meta.env.MODE;

// const dev_api = "http://10.0.12.85:5000";
const dev_api = "http://10.0.3.69:5000";
const live_api = "https://expressjs-uscv.onrender.com";

export const baseUrl = mode === "development" ? dev_api : live_api;

export const apiUrl =
  mode === "development" ? `${baseUrl}/api/v1/` : `${baseUrl}/api/v1`;
