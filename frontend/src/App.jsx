import { Suspense } from "react";
import { useGlobalProvider } from "./GlobalProvider";
import DefaultLayout from "./layout/DefaultLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getCustomTheme } from "./constants/theme";

function App() {
  const { deviceTheme } = useGlobalProvider();
  return (
    <Suspense fallback={<Loader open={true} />}>
      <ThemeProvider theme={getCustomTheme(deviceTheme)}>
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
