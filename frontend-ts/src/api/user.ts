import axios from "../hooks/AxiosInterceptor";

export const userLogin = async () => {
  try {
    const response = await axios.post("/auth/login");
    return response.data;
  } catch (error) {
    throw new Error();
  }
};
