import { Suspense } from "react";
import { useGlobalProvider } from "./GlobalProvider";
import DefaultLayout from "./layout/DefaultLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";

function App() {
  return (
    <Suspense fallback={<Loader open={true} />}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
