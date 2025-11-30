import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppBtn({ phone = "919876543210", message = "" }) {
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "50px",
        right: "30px",
        width: "55px",
        height: "55px",
        backgroundColor: "#25D366",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "28px",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
    >
      <FaWhatsapp />
    </a>
  );
}
