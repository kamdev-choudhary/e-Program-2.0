import useAxios from "../hooks/useAxios";

export const getAllExamTemplates = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/exam/templates");
  } catch (error) {
    console.error(error);
  }
};
