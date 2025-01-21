import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store.ts";
import { CustomModal } from "./components/CustomModal.tsx";
import AuthPage from "./pages/auth/AuthPage.tsx";
import "./i18";
import { useGlobalContext } from "./contexts/GlobalProvider.tsx";
import getTheme from "./constant/theme.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OnlineStatusIndicator from "./hooks/OnlineStatusIndicator.tsx";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const { theme } = useGlobalContext();
  const showAuth = useSelector((state: RootState) => state.showAuth);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
      <OnlineStatusIndicator />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
        limit={1}
        style={{ padding: 0 }}
      />

      <CustomModal
        open={showAuth}
        header=""
        autoClose={true}
        onClose={() => dispatch({ type: "SET_AUTHPAGE", payload: false })}
        showHeader={false}
        height="auto"
        width="auto"
      >
        <AuthPage />
      </CustomModal>
    </ThemeProvider>
  );
};

export default App;
