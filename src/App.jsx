import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster";
import Trending from "./pages/Trending";
import Goodies from "./pages/Goodies";
import MNv from "./components/Maninav";
import CartPage from "./pages/Cart";
import ImageDetails from "./pages/Details";
import User from './pages/User';
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import { CartProvider } from "./contexAndhooks/CartProvider"; 

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 🔥 Global loading 2.5 sec
    const timer = setTimeout(() => {
      setLoading(false);
      // 🔥 Content fade-in after loading
      setTimeout(() => setFadeIn(true), 50); // small delay for smooth effect
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#fff3eb",
        fontSize: "28px",
        fontWeight: "700",
        color: "#fe3d00",
        flexDirection: "column",
        textAlign: "center",
        gap: "20px"
      }}>
        Loading...
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #fe3d00",
          borderTop: "5px solid #fff3eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <CartProvider>
      {/* 🔥 Smooth fade-in wrapper */}
      <div style={{
        background: "#fff3eb",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-in"
      }}>
        <BrowserRouter>
          <MNv />
          <Routes>
            <Route path="/" element={<Trending />} />
            <Route path="/about" element={<About />} />
            <Route path="/sticker" element={<Sticker />} />
            <Route path="/poster" element={<Poster />} />
            <Route path="/goodies" element={<Goodies />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/image-details" element={<ImageDetails />} />
            <Route path="/account" element={<User />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search-results" element={<SearchResults />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;