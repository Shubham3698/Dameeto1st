import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

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
import LearningProductsPage from "./pages/LearningProductsPage";
import InventoryUpload from "./pages/InventoryUpload";
import AdminOrders from "./pages/AdminOrders";
import MemoryGame from './pages/MemoryGame';

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

  const location = useLocation();
  const navigate = useNavigate();

  // ---------------- POPUP SYSTEM ----------------

  const popupList = [
    {
      title: "🔥 Special Offer",
      text: "Buy 2 Stickers & Get 1 Free",
    },
    {
      title: "🚀 New Arrival",
      text: "Learning Products Now Available",
    },
    {
  title: "🎁 Combo Pack",
  text: "Special combo pack available — Stickers + Learning Books together at a better price!",
},
    {
      title: "🎁 Free Delivery",
      text: "Free delivery on orders above ₹499",
    }
  ];

  const [popupIndex, setPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // popup after page load + 5 sec
  useEffect(() => {

    if (!loading) {

      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);

      return () => clearTimeout(timer);

    }

  }, [loading]);

  const closePopup = () => {

    if (popupIndex < popupList.length - 1) {
      setPopupIndex(popupIndex + 1);
    } else {
      setShowPopup(false);
    }

  };

  // ---------------- LOADING ----------------

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  // ---------------- FLOATING BTN LOGIC ----------------

  const hiddenRoutes = ["/home", "/cart", "/search", "/search-results", "/view-order","/account","/memory-game"];

  const isButtonHidden =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/order/") ||
    location.pathname.startsWith("/image/");

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

      {/* ---------- POPUP ---------- */}

      {showPopup && (
        <div style={popupOverlay}>
          <div style={popupCard}>

            <button style={popupClose} onClick={closePopup}>
              ✖
            </button>

            <h2>{popupList[popupIndex].title}</h2>

            <p>{popupList[popupIndex].text}</p>

            <button
              style={popupBtn}
              onClick={() => {
                navigate("/home");
                setShowPopup(false);
              }}
            >
              Explore
            </button>

          </div>
        </div>
      )}

      {/* ---------- ROUTES ---------- */}

      <Routes>
        <Route path="/" element={<Trending />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/sticker" element={<Sticker />} />
        <Route path="/poster" element={<Poster />} />
        <Route path="/learning-products" element={<LearningProductsPage />} />
        <Route path="/goodies" element={<Goodies />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/image/:id" element={<ImageDetails />} />
        <Route path="/account" element={<User />} />
        <Route path="/inventory" element={<InventoryUpload />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/memory-game" element={<MemoryGame />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/view-order" element={<ViewOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="*" element={<div style={{ textAlign: "center", marginTop: "100px" }}><h2>404 - Not Found</h2></div>} />
      </Routes>

      {/* ---------- FLOATING BUTTON ---------- */}

      {!isButtonHidden && (
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

// ---------------- POPUP STYLE ----------------

const popupOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

const popupCard = {
  width: "320px",
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  textAlign: "center",
  position: "relative",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const popupClose = {
  position: "absolute",
  right: "12px",
  top: "10px",
  border: "none",
  background: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const popupBtn = {
  marginTop: "15px",
  padding: "10px 18px",
  background: "#fe3d00",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

// ---------------- EXISTING STYLES ----------------

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