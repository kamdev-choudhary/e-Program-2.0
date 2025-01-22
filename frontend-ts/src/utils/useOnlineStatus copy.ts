import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "../constant/constants";

const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const toggleTheme = (value: "light" | "dark") => {
    dispatch({ type: "SET_THEME", payload: value });
  };

  // Load theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (storedTheme) {
      dispatch({ type: "SET_THEME", payload: storedTheme as "light" | "dark" });
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      dispatch({
        type: "SET_THEME",
        payload: initialTheme,
      });
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, initialTheme);
    }
  }, []);

  return { toggleTheme, theme };
};

export default useTheme;
