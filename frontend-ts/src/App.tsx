import { Box, CssBaseline, LinearProgress, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store.ts";
import useOnlineStatus from "./hooks/useOnlineStatus.ts";
import { CustomModal } from "./components/CustomModal.tsx";
import AuthPage from "./pages/auth/AuthPage.tsx";
import "./i18";
import { useGlobalContext } from "./contexts/GlobalProvider.tsx";
import getTheme from "./constant/customTheme.ts";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const { theme } = useGlobalContext();
  const online = useSelector((state: RootState) => state.online);
  const showAuth = useSelector((state: RootState) => state.showAuth);
  const dispatch = useDispatch();

  const { loading } = useOnlineStatus();

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 100,
          width: "100vw",
        }}
      >
        <LinearProgress
          color={online ? "success" : "error"}
          value={loading ? undefined : 100}
          variant={loading ? "indeterminate" : "determinate"}
        />
      </Box>
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
