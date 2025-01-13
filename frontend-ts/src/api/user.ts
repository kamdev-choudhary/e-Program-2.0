import axios from "../hooks/AxiosInterceptor";

export const userLogin = async (user: []) => {
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
export const deleteUser = async (user: any) => {
  try {
    const response = await axios.delete(`/user/${user._id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Add new user
export const addNewUserAdmin = async (newUser: any) => {
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
  try {
    const response = await axios.patch(`/user/${user?._id}`, {
      ...user,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
