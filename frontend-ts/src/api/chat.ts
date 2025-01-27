import useAxios from "../hooks/useAxios";

interface User {
  _id: string;
}

export const getChats = async (user: User) => {
  const axios = useAxios();
  try {
    return await axios.get(`/chat/${user?._id}`);
  } catch (error) {
    throw error;
  }
};
