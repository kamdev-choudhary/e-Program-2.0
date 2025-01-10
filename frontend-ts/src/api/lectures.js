import axios from "../hooks/AxiosInterceptor";

export async function getLecturesByClass({ classLevel }) {
  try {
    const response = await axios.get(`/lectures/${classLevel || ""}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const addNewLectureSingle = async ({ newLecture }) => {
  try {
    const response = await axios.post(`/lectures`, { ...newLecture });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const addLecturesMultiple = async ({ formData }) => {
  try {
    const response = await axios.post(`/lectures/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteLecture = async ({ id }) => {
  try {
    const response = await axios.delete(`/lectures/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllLecturesWithPagination = async ({ limit = 0, page = 1 }) => {
  try {
    const response = await axios.get(
      `/lectures/getlectureswithpagination/${limit}/${page}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
