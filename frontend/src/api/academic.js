import axios from "../hooks/AxiosInterceptor";

// Centralized error handler
const handleApiError = (error, context = "api") => {
  const message = `Error in ${context}: ${error.message || "Unknown error"}`;
  console.error(message);
  throw new Error(message);
};

// Get all classes
export const getClasses = async () => {
  try {
    return await axios.get(`/academic/class`);
  } catch (error) {
    handleApiError(error, "getClasses");
  }
};

// Save a new class
export const addNewClass = async ({ newClass }) => {
  try {
    return await axios.post(`/academic/class`, newClass);
  } catch (error) {
    handleApiError(error, "addNewClass");
  }
};

// Delete a class
export const deleteClass = async ({ id }) => {
  try {
    return await axios.delete(`/academic/class/${id}`);
  } catch (error) {
    handleApiError(error, "deleteClass");
  }
};

// Edit a class
export const editClass = async ({ selectedClass }) => {
  try {
    const { _id, ...data } = selectedClass;
    return await axios.patch(`/academic/class/${_id}`, data);
  } catch (error) {
    handleApiError(error, "editClass");
  }
};

// Get all academic metadata
export const getAllAcademicData = async () => {
  try {
    return await axios.get(`/academic/metadata`);
  } catch (error) {
    handleApiError(error, "getAllAcademicData");
  }
};

// Get all question patterns
export const getAllQuestionPatterns = async () => {
  try {
    return await axios.get(`/academic/pattern`);
  } catch (error) {
    handleApiError(error, "getAllQuestionPatterns");
  }
};

// Add a new question pattern
export const addNewQuestionPattern = async ({ name, description }) => {
  try {
    return await axios.post(`/academic/pattern`, { name, description });
  } catch (error) {
    handleApiError(error, "addNewQuestionPattern");
  }
};

export const getAllSubjects = async () => {
  try {
    return await axios.get("/academic/subject");
  } catch (error) {
    handleApiError(error, "getSubjects");
  }
};

export const getAllSubSubjects = async () => {
  try {
    return await axios.get("/academic/sub-subject");
  } catch (error) {
    handleApiError(error, "getSubSubjects");
  }
};

export const getAllTopics = async () => {
  try {
    return await axios.get("/academic/topic");
  } catch (error) {
    handleApiError(error, "getAllTopics");
  }
};

export const getAllSubTopics = async () => {
  try {
    return await axios.get("/academic/sub-topic");
  } catch (error) {
    handleApiError(error, "GetAllSubTopics");
  }
};
