import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const Game = lazy(() => import("./pages/Game"));
const Ranking = lazy(() => import("./pages/Ranking"));
const TrainingGuide = lazy(() => import("./pages/TrainingGuide"));
const NBackPrinciples = lazy(() => import("./pages/NBackPrinciples"));
const SitePolicy = lazy(() => import("./pages/SitePolicy"));

const routeFallbackStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f6efe6",
  color: "#35291f",
  fontSize: "0.95rem",
  letterSpacing: "0.04em",
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={routeFallbackStyle}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/guide" element={<TrainingGuide />} />
          <Route path="/about-nback" element={<NBackPrinciples />} />
          <Route path="/policy" element={<SitePolicy />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
