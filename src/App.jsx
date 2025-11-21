import { BrowserRouter, Routes, Route } from "react-router-dom";
import HorizontalTopMenu from "./components/tpmenu";
import MasonryGallery from "./components/MasonryGallery";
import About from "./pages/about";

function App() {
  return (
    <BrowserRouter>
      <HorizontalTopMenu />
      <div style={{ marginTop: "50px" }}></div>

      <Routes>
        <Route path="/" element={<MasonryGallery />} />
        <Route path="/about" element={<About/>} />
        <Route path="/sticker" element={<h1>Sticker Page</h1>} />
        <Route path="/poster" element={<h1>Poster Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
