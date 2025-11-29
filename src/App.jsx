import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavbar from "./components/Maninav";
import Trending from "./pages/Trending";
import About from "./pages/About";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster";
import Goodies from "./pages/Goodies";

function App() {
  return (
    <BrowserRouter>
      {/* MainNavbar contains Top + Bottom nav */}
      <MainNavbar />

      {/* Content wrapper with top margin to prevent overlap */}
      <div style={{ marginTop: "110px", paddingBottom: "20px" }}>
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/sticker" element={<Sticker />} />
          <Route path="/poster" element={<Poster />} />
          <Route path="/goodies" element={<Goodies />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
