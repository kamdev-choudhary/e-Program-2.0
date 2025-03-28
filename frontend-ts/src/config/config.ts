// const LIVE_API = "https://expressjs-uscv.onrender.com";
const LIVE_API = "http://10.0.3.69:5000";

const DEV_API = import.meta.env.VITE_REACT_APP_API_URL;

export const MODE = import.meta.env.MODE;

export const BASE_URL = MODE === "development" ? LIVE_API : LIVE_API;

export const API_URL = `${BASE_URL}/api/v1`;

export const TINY_API_KEY = "";

export const SECRET = "qwertyuiopasdfghjklzxcvbnm789456";
