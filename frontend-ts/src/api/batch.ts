import useAxios from "../hooks/useAxios";

export const getAllBatches = async () => {
  const axios = useAxios();
  try {
    const response = await axios.get("/batch");
    return response;
  } catch (error) {
    console.error(error);
  }
};
