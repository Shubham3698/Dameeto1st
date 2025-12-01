import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Logo from "../assets/lg.png"; // <-- your round logo

export default function TopNavbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search-results?query=${query}`);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "#fff3eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* LEFT: Circular Logo */}
      <div style={{ marginRight: "10px" }}>
        <img
          src={Logo}
          alt="logo"
          style={{
            marginTop:"4px",
            marginLeft:"2px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />
      </div>

      {/* CENTER: Search Bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search Sticker & Goodies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            marginTop: "5px",
            width: "92%",
            maxWidth: "450px",
            height: "38px",
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
      <div style={{ display: "flex", gap: "16px", fontSize: "24px" }}>
        <Link className="icon-no-underline" to="/account" style={{ color: "#fe3d00" }}>
          <FaUserCircle />
        </Link>

        <Link className="icon-no-underline" to="/cart" style={{ color: "#fe3d00" }}>
          <FaShoppingCart />
        </Link>
      </div>

      <style>
        {`
          .icon-no-underline {
            text-decoration: none !important;
          }

          @media (max-width: 480px) {
            input {
              font-size: 14px !important;
              height: 34px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
