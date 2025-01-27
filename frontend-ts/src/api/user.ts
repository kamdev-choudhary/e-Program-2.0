import useAxios from "../hooks/useAxios";

export const userLogin = async (user: []) => {
  const axios = useAxios();
  try {
    return await axios.post("/auth/login", {
      ...user,
    });
  } catch (error) {
    console.error(error);
  }
};

// Register User
export const registerUser = async (user: []) => {
  const axios = useAxios();
  try {
    return await axios.post("/auth/register", {
      ...user,
    });
  } catch (error) {
    console.error(error);
  }
};

// Get users by role
export const getUsersByRole = async (role: string) => {
  const axios = useAxios();
  try {
    const response = await axios.get(`/user/role/${role}`);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

// Upload profile pic
export const uploadProfilePic = async (user: any, photo: string) => {
  const axios = useAxios();
  try {
    const response = await axios.post(`/user/profile-pic`, {
      id: user?._id,
      photo: photo,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  const axios = useAxios();
  try {
    const response = await axios.delete(`/user/${userId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Add new user
export const addNewUserAdmin = async (newUser: any) => {
  const axios = useAxios();
  try {
    const response = await axios.post("/auth/register", {
      ...newUser,
      method: "admin",
      password: "Password",
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Save Edited User
export const saveEditUser = async (user: any) => {
  const axios = useAxios();
  try {
    const response = await axios.patch(`/user/${user?._id}`, {
      ...user,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
