import { BrowserRouter, Routes, Route } from "react-router-dom";
import HorizontalTopMenu from "./components/tpmenu";
import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster"
import Trending from "./pages/Trending"
// import { div } from "framer-motion/client";

function App() {
  return (
    <div style={{background:"#fff3eb"}} >
      <BrowserRouter>
        <HorizontalTopMenu />
        <div style={{ marginTop: "60px" }}></div>

        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/sticker" element={<Sticker/>} />
          <Route path="/poster" element={<Poster/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
