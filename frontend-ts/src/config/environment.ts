const LIVE_API = "https://expressjs-uscv.onrender.com";

// const DEV_API = import.meta.env.VITE_REACT_APP_API_URL;
const DEV_API = "http://10.0.12.85:5000";

export const MODE = import.meta.env.MODE;

export const BASE_URL = MODE === "development" ? DEV_API : LIVE_API;
export const API_URL = `${BASE_URL}/api/v1`;

export const TINY_API_KEY = "";

export const SECRET = "qwertyuiopasdfghjklzxcvbnm789456";
