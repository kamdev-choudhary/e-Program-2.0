import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { lightTheme } from "./constant/theme.ts";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store.ts";
import useOnlineStatus from "./hooks/useOnlineStatus.ts";
import { CustomModal } from "./components/CustomModal.tsx";
import AuthPage from "./pages/auth/AuthPage.tsx";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const online = useSelector((state: RootState) => state.online);
  const showAuth = useSelector((state: RootState) => state.showAuth);
  const dispatch = useDispatch();

  useOnlineStatus();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      {!online && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            width: "100vW",
            bgcolor: "#FF8383",
            py: 0.5,
          }}
        >
          <Typography sx={{ color: "#640D5F" }}>Backend offline</Typography>
        </Box>
      )}
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
