import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";

export default function ImageDetails() {
  const { state } = useLocation();
  const { addToCart } = useContext(CartContext);
  const item = state?.item;

  const mainImage = item?.src;
  const fromCategory = state?.category;
  const relatedImages = state?.images || [];

  const [expanded, setExpanded] = useState(false);
  const title = item?.title;
  const shortDesc = item?.shortDesc;
  const longDesc = item?.longDesc;
  const price = item?.price || 199;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mainImage]);

  const handleAddToCart = () => {
    addToCart({ src: mainImage, title, price });
    alert(`${title} added to cart!`);
  };

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <img
          src={mainImage}
          style={{ width: "100%", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}
        />

        <h2 className="mt-4">{title}</h2>

        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          {expanded ? longDesc : shortDesc}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "transparent", color: "#fe3d00", border: "none", fontWeight: "600" }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button
            onClick={handleAddToCart}
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

        <h3 className="mt-5 text-capitalize">More from {fromCategory}</h3>
        <Nwmasonry images={relatedImages} categoryName={fromCategory} />
      </div>
    </div>
  );
}
