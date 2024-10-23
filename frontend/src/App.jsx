import { Suspense } from "react";
import { useGlobalProvider } from "./GlobalProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "./constants/theme";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  const { isLoggedIn } = useGlobalProvider();

  return (
    <Suspense fallback={<Loader open={true} />}>
      <ThemeProvider theme={lightTheme}>
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
