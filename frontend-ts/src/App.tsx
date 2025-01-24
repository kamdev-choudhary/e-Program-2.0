import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./i18";
import getTheme from "./constant/theme.ts";
import useTheme from "./utils/useTheme.ts";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
