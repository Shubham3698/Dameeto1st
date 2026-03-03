import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import About from "./pages/about";
import Sticker from "./pages/Sticker";
import Poster from "./pages/Poster";
import Trending from "./pages/Trending";
import Goodies from "./pages/Goodies";
import MNv from "./components/Maninav";
import CartPage from "./pages/Cart";
import ImageDetails from "./pages/Details";
import User from "./pages/User";
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import ViewOrders from "./pages/ViewOrders";
import OrderDetails from "./pages/OrderDetails"; 
import HomePage from "./pages/HomePage"; 

import { CartProvider } from "./contexAndhooks/CartProvider";

function AppWrapper() {
  return (
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation(); // 👈 current route

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={loadingStyles}>
        Loading...
        <div style={spinnerStyles} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff3eb",
        minHeight: "100vh",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-in",
        position: "relative",
      }}
    >
      <MNv />

      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/sticker" element={<Sticker />} />
        <Route path="/poster" element={<Poster />} />
        <Route path="/goodies" element={<Goodies />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/image/:id" element={<ImageDetails />} />
        <Route path="/account" element={<User />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/view-order" element={<ViewOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="*" element={<div style={{ textAlign: "center", marginTop: "100px" }}><h2>404 - Not Found</h2></div>} />
      </Routes>

      {/* ✅ Floating Button Hide on /home */}
      {location.pathname !== "/home" && (
        <Link
          to="/home"
          style={floatingBtnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
          }}
        >
          🏠
        </Link>
      )}
    </div>
  );
}

// --- Styles ---
const loadingStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#fff3eb",
  fontSize: "28px",
  fontWeight: "700",
  color: "#fe3d00",
  flexDirection: "column",
  gap: "20px",
};

const spinnerStyles = {
  width: "50px",
  height: "50px",
  border: "5px solid #fe3d00",
  borderTop: "5px solid #fff3eb",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const floatingBtnStyle = {
  position: "fixed",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#fe3d00",
  color: "white",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  fontSize: "24px",
  boxShadow: "0px 4px 20px rgba(254, 61, 0, 0.4)",
  zIndex: 1000,
  transition: "all 0.3s ease",
};

export default AppWrapper;