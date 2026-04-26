import React from "react";
import { FaShippingFast } from "react-icons/fa";

export default function DeliveryBar() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginTop: "12px",
        padding: "8px 12px",
        borderRadius: "20px",
        overflow: "hidden", // 🔥 reflection cut karega
        
      }}
    >
      {/* 🔥 SHINE EFFECT */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)",
          animation: "shine 2.5s infinite",
        }}
      />

      {/* CONTENT */}
      <FaShippingFast size={16} color="#fe3d00" />

      <span
        style={{
          fontSize: "13px",
          color: "#444",
          fontWeight: "500",
        }}
      >
        Fast Pan India Delivery
      </span>

      {/* 🔥 KEYFRAMES */}
      <style>
        {`
          @keyframes shine {
            0% { left: -100%; }
            100% { left: 150%; }
          }
        `}
      </style>
    </div>
  );
}