import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster"
import Trending from "./pages/Trending"
import Goodies from "./pages/Goodies"
import MNv from "./components/Maninav"
import CartPage from "./pages/Cart";
import ImageDetails from "./pages/Details";
import User from './pages/User'

function App() {
  return (
    <div style={{background:"#fff3eb"}} >
      <BrowserRouter>
        <MNv/>
        <Routes>
          <Route path="/" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/sticker" element={<Sticker/>} />
          <Route path="/poster" element={<Poster/>} />
          <Route path="/goodies" element={<Goodies/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/image-details" element={<ImageDetails />} />
          <Route path="/account" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
