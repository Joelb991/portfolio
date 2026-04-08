
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Interests from "./pages/Interests/Interests";
import Contact from "./pages/Contact/Contact";
import { palette } from "./styles/palette";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: palette.jetBlack,
        color: palette.ashGrey,
        minHeight: "100vh",
      }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

