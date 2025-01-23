import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "../constant/constants";

const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const toggleTheme = (value: "light" | "dark") => {
    // Update the theme in both Redux and localStorage
    dispatch({ type: "SET_THEME", payload: value });
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, value);
  };

  // Load theme preference on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);

    if (storedTheme && storedTheme !== theme) {
      // If a theme is stored and it's not already the active theme, apply it
      dispatch({ type: "SET_THEME", payload: storedTheme as "light" | "dark" });
    } else if (!storedTheme) {
      // If no theme is stored, use system preference as the fallback
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      dispatch({ type: "SET_THEME", payload: initialTheme });
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, initialTheme);
    }
  }, [dispatch, theme]);

  return { toggleTheme, theme };
};

export default useTheme;
