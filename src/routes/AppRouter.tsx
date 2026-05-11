import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PetDetailPage from "../pages/PetDetailPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/pets/:title" element={<PetDetailPage />} />
    </Routes>
  );
};

export { AppRouter };
