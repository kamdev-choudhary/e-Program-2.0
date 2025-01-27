import useAxios from "../hooks/useAxios";

// Helper function to initialize Axios
export const getAxiosInstance = () => {
  return useAxios(); // This ensures the hook is used properly inside a React context
};

// Get Doubts by Status
export const getDoubtsByStatus = async () => {
  const axiosInstance = getAxiosInstance(); // Declare axiosInstance here
  try {
    const response = await axiosInstance.get("/doubts/");
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
  const axiosInstance = getAxiosInstance(); // Declare axiosInstance here
  try {
    const response = await axiosInstance.post("/doubts/pagination", {
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
