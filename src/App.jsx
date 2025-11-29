import { BrowserRouter, Routes, Route } from "react-router-dom";
import HorizontalTopMenu from "./components/tpmenu";
import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster"
import Trending from "./pages/Trending"
import Goodies from "./pages/Goodies"
import Testnav from "./components/Testnav"
import Logonav from "./components/Logonav"
import MNv from "./components/Maninav"

// import { div } from "framer-motion/client";

function App() {
  return (
    <div style={{background:"#fff3eb"}} >
      <BrowserRouter>
        {/* <HorizontalTopMenu /> */}
        {/* <Testnav/> */}
        {/* <Logonav/> */}
        <MNv/>
        <div style={{ marginTop: "105px" }}></div>

        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/sticker" element={<Sticker/>} />
          <Route path="/poster" element={<Poster/>} />
          <Route path="/goodies" element={<Goodies/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
