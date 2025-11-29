import React from "react";
import { Link } from "react-router-dom";

export default function TopNavbar() {
  return (
    <div
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
      <div style={{ display: "flex", gap: "18px", fontSize: "22px" }}>
        <Link className="icon-no-underline" to="/account" style={{ color: "#fe3d00" }}>
          👤
        </Link>
        <Link className="icon-no-underline" to="/cart" style={{ color: "#fe3d00" }}>
          🛒
        </Link>
      </div>

      {/* ZERO underline CSS */}
      <style>
        {`
          .icon-no-underline {
            text-decoration: none !important;
          }

          .icon-no-underline::after,
          .icon-no-underline:hover::after,
          .icon-no-underline:active::after {
            display: none !important;
            content: none !important;
          }
        `}
      </style>
    </div>
  );
}
