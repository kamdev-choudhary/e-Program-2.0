const DEV_API = "http://10.0.12.85:5000";
// const DEV_API = "http://10.0.3.69:5000";
const LIVE_API = "https://expressjs-uscv.onrender.com";

export const MODE = import.meta.env.MODE;

export const BASE_URL = MODE === "development" ? DEV_API : LIVE_API;
export const API_URL = `${BASE_URL}/api/v1`;
