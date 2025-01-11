export const mode = import.meta.env.MODE;

export const baseUrl =
  mode === "development"
    ? "http://10.0.3.69:5000"
    : "https://expressjs-uscv.onrender.com";

export const apiUrl =
  mode === "development" ? `${baseUrl}/api/v1/` : `${baseUrl}/api/v1`;
