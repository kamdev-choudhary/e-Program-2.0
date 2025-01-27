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

// Constants for endpoints
const API_PATHS = {
  CLASSES: "/academic/class",
  METADATA: "/academic/metadata",
  PATTERNS: "/academic/pattern",
  SUBJECTS: "/academic/subject",
  SUB_SUBJECTS: "/academic/sub-subject",
  TOPICS: "/academic/topic",
  SUB_TOPICS: "/academic/sub-topic",
};

// Get all classes
export const getClasses = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.CLASSES);
  } catch (error) {
    throw error;
  }
};

// Save a new class
export const addNewClass = async (newClass: ClassData) => {
  const axios = useAxios();
  try {
    return await axios.post(API_PATHS.CLASSES, newClass);
  } catch (error) {
    throw error;
  }
};

// Delete a class
export const deleteClass = async (id: string) => {
  const axios = useAxios();
  try {
    return await axios.delete(`${API_PATHS.CLASSES}/${id}`);
  } catch (error) {
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
    return await axios.put(`${API_PATHS.CLASSES}/${_id}`, data);
  } catch (error) {
    throw error;
  }
};

// Get all academic metadata
export const getAllAcademicData = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.METADATA);
  } catch (error) {
    throw error;
  }
};

// Get all question patterns
export const getAllQuestionPatterns = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.PATTERNS);
  } catch (error) {
    throw error;
  }
};

// Add a new question pattern
export const addNewQuestionPattern = async (data: QuestionPatternData) => {
  const axios = useAxios();
  try {
    return await axios.post(API_PATHS.PATTERNS, data);
  } catch (error) {
    throw error;
  }
};

// Get all subjects
export const getAllSubjects = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.SUBJECTS);
  } catch (error) {
    throw error;
  }
};

// Get all sub-subjects
export const getAllSubSubjects = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.SUB_SUBJECTS);
  } catch (error) {
    throw error;
  }
};

// Get all topics
export const getAllTopics = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.TOPICS);
  } catch (error) {
    throw error;
  }
};

// Get all sub-topics
export const getAllSubTopics = async () => {
  const axios = useAxios();
  try {
    return await axios.get(API_PATHS.SUB_TOPICS);
  } catch (error) {
    throw error;
  }
};
