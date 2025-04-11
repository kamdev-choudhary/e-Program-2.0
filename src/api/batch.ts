import axios from "../hooks/AxiosInterceptor";

export const getAllBatches = async () => {
  try {
    const response = await axios.get("/batch");
    return response;
  } catch (error) {
    console.error(error);
  }
};
