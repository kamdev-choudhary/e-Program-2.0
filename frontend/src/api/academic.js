import axios from "axios";
import { API_URL } from "../constants/helper";

export const getClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/academic/class`);
    return response;
  } catch (error) {
    console.error(error);
    throw new error();
  }
};
