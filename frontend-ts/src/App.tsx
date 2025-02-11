import { RouterProvider } from "react-router-dom";
import routes from "./routes.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./i18";

// Create QueryClient once outside the component
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
};

export default App;
