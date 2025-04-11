import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "../hooks/AxiosInterceptor";

const useOnlineStatus = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const online = useSelector((state: RootState) => state.online);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/");
      if (response.status === 200) {
        dispatch({ type: "SET_ONLINE", payload: true });
      }
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
  }, []);

  return { loading, online, fetchStatus };
};

export default useOnlineStatus;
