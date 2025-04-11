import axios from "../hooks/AxiosInterceptor";

interface User {
  _id: string;
}

export const getChats = async (user: User) => {
  try {
    return await axios.get(`/chat/${user?._id}`);
  } catch (error) {
    throw error;
  }
};
