import useAxios from "../hooks/useAxios";

// Define interfaces for type safety
interface ClassData {
  _id?: string; // Optional for new class
  name: string;
  description?: string;
}

interface QuestionPatternData {
  name: string;
  description: string;
}

// Get all classes
export const getClasses = async () => {
  const axios = useAxios();
  try {
    return await axios.get(`/academic/class`);
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

// Save a new class
export const addNewClass = async (newClass: ClassData) => {
  const axios = useAxios();
  try {
    return await axios.post(`/academic/class`, newClass);
  } catch (error) {
    console.error("Error adding new class:", error);
    throw error;
  }
};

// Delete a class
export const deleteClass = async (id: string) => {
  const axios = useAxios();
  try {
    return await axios.delete(`/academic/class/${id}`);
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

// Edit a class
export const editClass = async (selectedClass: ClassData) => {
  const axios = useAxios();
  try {
    const { _id, ...data } = selectedClass;
    if (!_id) {
      throw new Error("Class ID is required for editing.");
    }
    return await axios.patch(`/academic/class/${_id}`, data);
  } catch (error) {
    console.error("Error editing class:", error);
    throw error;
  }
};

// Get all academic metadata
export const getAllAcademicData = async () => {
  const axios = useAxios();
  try {
    return await axios.get(`/academic/metadata`);
  } catch (error) {
    console.error("Error fetching academic metadata:", error);
    throw error;
  }
};

// Get all question patterns
export const getAllQuestionPatterns = async () => {
  const axios = useAxios();
  try {
    return await axios.get(`/academic/pattern`);
  } catch (error) {
    console.error("Error fetching question patterns:", error);
    throw error;
  }
};

// Add a new question pattern
export const addNewQuestionPattern = async (data: QuestionPatternData) => {
  const axios = useAxios();
  try {
    return await axios.post(`/academic/pattern`, data);
  } catch (error) {
    console.error("Error adding new question pattern:", error);
    throw error;
  }
};

// Get all subjects
export const getAllSubjects = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/academic/subject");
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

// Get all sub-subjects
export const getAllSubSubjects = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/academic/sub-subject");
  } catch (error) {
    console.error("Error fetching sub-subjects:", error);
    throw error;
  }
};

// Get all topics
export const getAllTopics = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/academic/topic");
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

// Get all sub-topics
export const getAllSubTopics = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/academic/sub-topic");
  } catch (error) {
    console.error("Error fetching sub-topics:", error);
    throw error;
  }
};

export const addNewSubject = async (newSubject: any) => {
  const axios = useAxios();
  try {
    return await axios.post("/academic/subject", newSubject);
  } catch (error) {
    throw error;
  }
};

export const getAllSyllabus = async () => {
  const axios = useAxios();
  try {
    return await axios.get("/academic/syllabus");
  } catch (error) {
    throw error;
  }
};
