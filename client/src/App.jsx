import { Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { useTheme } from "./hooks/useTheme.js";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";
import DayPage from "./pages/DayPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import PlacementPage from "./pages/PlacementPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function ThemeSync() {
  const { data } = useApp();
  useTheme(data.settings.theme);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeSync />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/day/:dayNumber" element={<DayPage />} />
          <Route path="/problem/:problemId" element={<ProblemPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
