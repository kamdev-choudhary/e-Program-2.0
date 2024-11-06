import axios from "axios";
import { API_URL } from "../constants/helper";

export async function getLecturesByClass({ className }) {
  try {
    const response = await axios.get(`${API_URL}/lectures/${className}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
