import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "./constant/theme.ts";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
