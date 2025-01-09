import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<DefaultLayout />} />
      </Routes>
    </>
  );
};

export default App;
