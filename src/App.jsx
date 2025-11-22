import { BrowserRouter, Routes, Route } from "react-router-dom";
import HorizontalTopMenu from "./components/tpmenu";
import MasonryGallery from "./components/MasonryGallery";
import About from "./pages/about";
// import { div } from "framer-motion/client";

function App() {
  return (
    <div style={{background:"#dadada"}} >
      <BrowserRouter>
        <HorizontalTopMenu />
        <div style={{ marginTop: "60px" }}></div>

        <Routes>
          <Route path="/" element={<MasonryGallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/sticker" element={<h1>Sticker Page</h1>} />
          <Route path="/poster" element={<h1>Poster Page</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
