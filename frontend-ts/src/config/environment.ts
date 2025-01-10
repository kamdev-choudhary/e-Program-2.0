export const mode = import.meta.env.MODE;

export const apiUrl =
  mode === "development"
    ? "http://10.0.3.69:5000"
    : "https://expressjs-uscv.onrender.com";
