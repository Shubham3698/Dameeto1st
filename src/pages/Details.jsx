import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";

export default function ImageDetails() {
  const { state } = useLocation();

  const mainImage = state?.src;
  const fromCategory = state?.category ;
  const relatedImages = state?.images || [];

  const [expanded, setExpanded] = useState(false);

  const title = "Beautiful Sticker Design";
  const shortDesc = "This is a high-quality premium sticker design.";
  const longDesc =
    "This sticker is crafted with precision, representing emotions, vibes, personality and style. It fits perfectly on phone covers, laptops, notebooks etc.";

  // Scroll to top on image change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mainImage]);

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Main Image */}
        <img
          src={mainImage}
          alt="Selected"
          style={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        />

        {/* Title */}
        <h2 className="mt-4">{title}</h2>

        {/* Description */}
        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          {expanded ? longDesc : shortDesc}
        </p>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            border: "none",
            background: "transparent",
            color: "#fe3d00",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
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
              gap: "8px",
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
              fontSize: "20px",
            }}
          >
            <FaHeart />
          </button>
        </div>

        {/* Related Images Section */}
        <h3 className="mt-5 text-capitalize">More from {fromCategory}</h3>
        <Nwmasonry images={relatedImages} pageName={fromCategory} />
      </div>
    </div>
  );
}
