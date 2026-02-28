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
import User from "./pages/User";
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import ViewOrders from "./pages/ViewOrders";
import OrderDetails from "./pages/OrderDetails"; // ✅ NEW IMPORT

import { CartProvider } from "./contexAndhooks/CartProvider";

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 Loading Screen (unchanged)
  if (loading) {
    return (
      <div
        style={{
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
          gap: "20px",
        }}
      >
        Loading...
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #fe3d00",
            borderTop: "5px solid #fff3eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
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
      <BrowserRouter>
        <div
          style={{
            background: "#fff3eb",
            minHeight: "100vh",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.8s ease-in",
          }}
        >
          {/* 🔥 Navbar Always Visible */}
          <MNv />

          <Routes>
            {/* 🏠 Main Pages */}
            <Route path="/" element={<Trending />} />
            <Route path="/about" element={<About />} />
            <Route path="/sticker" element={<Sticker />} />
            <Route path="/poster" element={<Poster />} />
            <Route path="/goodies" element={<Goodies />} />
            <Route path="/cart" element={<CartPage />} />

            {/* 🖼 Dynamic Product Page */}
            <Route path="/image/:id" element={<ImageDetails />} />

            {/* 👤 Account */}
            <Route path="/account" element={<User />} />

            {/* 🔎 Search */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search-results" element={<SearchResults />} />

            {/* 📦 Orders */}
            <Route path="/view-order" element={<ViewOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} /> {/* ✅ NEW */}

            {/* 🚫 404 Page */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;