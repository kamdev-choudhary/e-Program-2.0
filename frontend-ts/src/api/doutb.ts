import axios from "../hooks/AxiosInterceptor";

export const getDoubtsByStatus = async () => {
  try {
    return await axios.get("/doubts/");
  } catch (error) {
    throw error;
  }
};
