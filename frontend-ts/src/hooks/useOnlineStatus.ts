import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { baseUrl } from "../config/environment";

const useOnlineStatus = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl);
      const status = response.ok;
      dispatch({ type: "SET_ONLINE", payload: status });
    } catch (error) {
      console.error("Error fetching status:", error);
      dispatch({ type: "SET_ONLINE", payload: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 20000); // Poll every 20 seconds
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return { loading };
};

export default useOnlineStatus;
