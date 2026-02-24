import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Logo from "../assets/lg.png";
import SignInModal from "./SignInModal";

export default function TopNavbar() {
  const [query, setQuery] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search-results?query=${query}`);
    }
  };

  // 🔥 User icon click handler
  const handleUserClick = () => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      // ✅ Already logged in
      navigate("/account");
    } else {
      // ❌ Not logged in
      setShowSignIn(true);
    }
  };

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
          }}
        >
          {/* 👇 Updated User Icon Logic */}
          <FaUserCircle
            style={{ color: "#fe3d00", cursor: "pointer" }}
            onClick={handleUserClick}
          />

          <Link to="/cart" style={{ color: "#fe3d00" }}>
            <FaShoppingCart />
          </Link>
        </div>
      </nav>

      {/* ===== Modal ===== */}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}