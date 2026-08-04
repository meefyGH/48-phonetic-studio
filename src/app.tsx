import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage/HomePage";
import LearnPage from "@/pages/LearnPage/LearnPage";
import QuizPage from "@/pages/QuizPage/QuizPage";
import ComparePage from "@/pages/ComparePage/ComparePage";
import MouthPage from "@/pages/MouthPage/MouthPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="mouth" element={<MouthPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
