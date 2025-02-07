import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./i18";
import getTheme from "./constant/theme.ts";
import useTheme from "./utils/useTheme.ts";
import { useMemo, Suspense } from "react";
import Loader from "./components/Loader.tsx";

// Create QueryClient once outside the component
const queryClient = new QueryClient();

const App: React.FC = () => {
  const { theme } = useTheme();

  // Memoize theme to avoid unnecessary recalculations
  const muiTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={routes} />
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
