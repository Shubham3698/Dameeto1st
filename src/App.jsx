import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

import HorizontalTopMenu from "./components/tpmenu";
import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster";
import Trending from "./pages/Trending";
import Goodies from "./pages/Goodies";
import Testnav from "./components/Testnav";
import Logonav from "./components/Logonav";
import MNv from "./components/Maninav";

function SwipeHandler({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const startX = useRef(0);
  const endX = useRef(0);

  // 🔥 Allowed pages order
  const pages = ["/", "/sticker", "/poster", "/goodies", "/about"];

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = endX.current - startX.current;

    if (Math.abs(distance) < 70) return; // Small movement ignore

    const currentIndex = pages.indexOf(location.pathname);

    if (distance > 70) {
      // 👉 Swipe Right = previous page
      if (currentIndex > 0) navigate(pages[currentIndex - 1]);
    } else {
      // 👈 Swipe Left = next page
      if (currentIndex < pages.length - 1) navigate(pages[currentIndex + 1]);
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <div style={{ background: "#fff3eb" }}>
      <BrowserRouter>
        <SwipeHandler>
          <MNv />
          <div style={{ marginTop: "105px" }}></div>

          <Routes>
            <Route path="/" element={<Trending />} />
            <Route path="/about" element={<About />} />
            <Route path="/sticker" element={<Sticker />} />
            <Route path="/poster" element={<Poster />} />
            <Route path="/goodies" element={<Goodies />} />
          </Routes>
        </SwipeHandler>
      </BrowserRouter>
    </div>
  );
}

export default App;
