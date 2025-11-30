import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Sticker from "./Sticker";

export default function ImageDetails() {
  const { state } = useLocation();
  const img = state?.src;

  const [expanded, setExpanded] = useState(false);

  const title = "Beautiful Sticker Design";
  const shortDesc = "This is a high-quality premium sticker design.";
  const longDesc =
    "This sticker is crafted with precision, representing emotions, vibes, personality and style. It fits perfectly on phone covers, laptops, notebooks etc.";

  // Scroll to top whenever `img` changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [img]);

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Full Image */}
        <img
          src={img}
          alt=""
          style={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
          }}
        />

        {/* TITLE */}
        <h2 className="mt-4">{title}</h2>

        {/* DESCRIPTION */}
        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          {expanded ? longDesc : shortDesc}
        </p>

        {/* EXPAND BUTTON */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            border: "none",
            background: "transparent",
            color: "#fe3d00",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

        {/* BUTTONS */}
        <div className="d-flex mt-4" style={{ gap: "20px" }}>
          <button
            style={{
              background: "#fe3d00",
              color: "white",
              padding: "12px 20px",
              borderRadius: "50px",
              border: "none",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaShoppingCart /> Add to Cart
          </button>

          <button
            style={{
              background: "white",
              border: "2px solid #fe3d00",
              color: "#fe3d00",
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}
          >
            <FaHeart />
          </button>
        </div>

        {/* Sticker Section */}
        <Sticker />
      </div>
    </div>
  );
}
