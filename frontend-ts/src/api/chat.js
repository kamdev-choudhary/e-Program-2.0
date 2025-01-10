import axios from "../hooks/AxiosInterceptor";

const handleApiError = (error, context = "api") => {
  const message = `Error in ${context}: ${error.message || "Unknown error"}`;
  console.error(message); // Log the error for debugging
  throw new Error(message); // Retain context in the thrown error
};

export const getChats = async ({ user }) => {
  try {
    console.log(user);
    return await axios.get(`/chat/${user?._id}`);
  } catch (error) {
    handleApiError(error, "getChats");
  }
};
