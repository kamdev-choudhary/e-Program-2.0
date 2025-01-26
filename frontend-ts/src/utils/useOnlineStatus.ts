import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../config/environment";
import { RootState } from "../store/store";

const useOnlineStatus = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const online = useSelector((state: RootState) => state.online);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(BASE_URL);
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

  return { loading, online, fetchStatus };
};

export default useOnlineStatus;
