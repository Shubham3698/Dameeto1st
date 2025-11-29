import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

export default function TopNavbar() {
  return (
    <div
      style={{
        width: "100vw",
        height: "60px",
        backgroundColor: "#fff3eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* Left: Logo */}
      <div style={{ fontSize: "24px", fontWeight: "800", color: "#fe3d00" }}>
        <Link to="/" style={{ color: "#fe3d00", textDecoration: "none" }}>
          Dameeto
        </Link>
      </div>

      {/* Center: Text */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        Explore
      </div>

      {/* Right: Icons */}
      <div style={{ display: "flex", gap: "18px", fontSize: "24px", color:"#fe3d00" }}>
        <Link to="/account">
          <FaUserCircle />
        </Link>
        <Link to="/cart">
          <FaShoppingCart />
        </Link>
      </div>
    </div>
  );
}
