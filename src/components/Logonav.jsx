import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Link ki zarurat nahi ab navigate use karenge
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Logo from "../assets/lg.png";
import SignInModal from "./SignInModal";
import { CartContext } from "../contexAndhooks/CartContext";

export default function TopNavbar() {
  const [query, setQuery] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [pop, setPop] = useState(false); // animation state
  const navigate = useNavigate();

  // 🔹 Context se cartItems aur hamara naya Loading state nikala
  const { cartItems, setIsGlobalLoading } = useContext(CartContext);

  // 🔹 Cart Click Handler: Ye screen lock karega aur fir navigate karega
  const handleCartClick = (e) => {
    setIsGlobalLoading(true); // Screen Lock ON
    setTimeout(() => {
      navigate("/cart");
      setIsGlobalLoading(false); // Screen Lock OFF
    }, 400); // 0.4 second ka chota sa delay taki multiple clicks na ho
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search-results?query=${query}`);
    }
  };

  const handleUserClick = () => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      navigate("/account");
    } else {
      setShowSignIn(true);
    }
  };

  // Total quantity for badge
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 🔹 Pop animation effect (Wahi purana logic)
  useEffect(() => {
    if (totalQuantity > 0) {
      const timer = setTimeout(() => {
        setPop(true);
        const hideTimer = setTimeout(() => setPop(false), 300);
        return () => clearTimeout(hideTimer);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  return (
    <>
      {/* ===== Navbar ===== */}
      <nav
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#fff3eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {/* LEFT: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={Logo}
            alt="logo"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "12px",
            }}
          />
        </div>

        {/* CENTER: Search */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Search Sticker & Goodies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              width: "100%",
              maxWidth: "450px",
              height: "40px",
              borderRadius: "20px",
              padding: "0 14px",
              border: "1px solid #ffb291",
              outline: "none",
              fontSize: "15px",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        {/* RIGHT: Icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            marginLeft: "6px",
            position: "relative",
          }}
        >
          {/* User Icon */}
          <FaUserCircle
            style={{ color: "#fe3d00", cursor: "pointer" }}
            onClick={handleUserClick}
          />

          {/* 🔹 Cart Icon Wrapper: Link ko div mein badla hai click handle karne ke liye */}
          <div
            onClick={handleCartClick}
            style={{ 
              color: "#fe3d00", 
              position: "relative", 
              display: "flex", 
              cursor: "pointer" // Cursor pointer zaroori hai
            }}
          >
            <FaShoppingCart style={{ fontSize: "26px" }} />
            {totalQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#fe3d00",
                  color: "#fff",
                  fontSize: "12px",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  border: "2px solid white",
                  transform: pop ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Sign In Modal */}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}