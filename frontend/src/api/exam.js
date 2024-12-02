import axios from "../hooks/AxiosInterceptor";

export const getAllExamTemplates = async () => {
  try {
    return await axios.get("/exam/templates");
  } catch (error) {
    console.error(error);
  }
};
