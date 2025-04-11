import axios from "../hooks/AxiosInterceptor";

// Helper function to initialize Axios

// Get Doubts by Status
export const getDoubtsByStatus = async () => {
  try {
    const response = await axios.get("/doubts/");
    return response.data; // Extract and return the data
  } catch (error) {
    console.error("Error fetching doubts by status:", error);
    throw error;
  }
};

// Get Doubts with Pagination
export const getDoubtsWithPagination = async ({
  currentPage,
  filter,
}: {
  currentPage: number;
  filter: string;
}) => {
  try {
    const response = await axios.post("/doubts/pagination", {
      page: currentPage,
      status: filter,
      limit: 10,
    });
    return response.data; // Extract and return the data
  } catch (error) {
    console.error("Error fetching doubts with pagination:", error);
    throw error;
  }
};
