import { Suspense } from "react";
import { useGlobalProvider } from "./GlobalProvider";
import DefaultLayout from "./layout/DefaultLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { darkTheme, lightTheme } from "./constants/theme";

function App() {
  const { deviceTheme } = useGlobalProvider();
  const theme = createTheme();
  return (
    <Suspense fallback={<Loader open={true} />}>
      <ThemeProvider theme={deviceTheme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
