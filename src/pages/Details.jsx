import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";

export default function ImageDetails() {
  const { state } = useLocation();
  const { addToCart } = useContext(CartContext);
  const item = state?.item;

  const fromCategory = state?.category;
  const relatedImages = state?.images || [];

  const title = item?.title;
  const shortDesc = item?.shortDesc;
  const longDesc = item?.longDesc;

  const price = item?.finalPrice ?? 199;
  const originalPrice = item?.originalPrice ?? null;

  const [expanded, setExpanded] = useState(false);

  // ✅ All Images (Main + SubImages)
  const imagesArray = useMemo(() => {
    if (!item) return [];
    if (item.subImages && item.subImages.length > 0) {
      return [item.src, ...item.subImages];
    }
    return item?.src ? [item.src] : [];
  }, [item]);

  // ✅ Lazy initializer (NO ESLINT ERROR)
  const [selectedImage, setSelectedImage] = useState(
    () => imagesArray[0]
  );

  // ✅ Only scroll effect (allowed)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [item]);

  const handleAddToCart = () => {
    addToCart({
      src: selectedImage,
      title,
      shortDesc,
      longDesc,
      price,
      originalPrice
    });

    alert(`${title} added to cart!`);
  };

  return (
    <div
      key={item?.src}
      style={{ background: "#fff3eb", minHeight: "100vh", padding: "20px" }}
    >
      <style>{`
        .main-image {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .thumbnail-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 15px 0;
        }

        .thumb {
          min-width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          border: 2px solid #ddd;
          transition: 0.2s ease;
        }

        .active-thumb {
          border: 3px solid #fe3d00;
        }

        .thumbnail-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* 🔥 Main Image */}
        {selectedImage && (
          <img
            src={selectedImage}
            className="main-image"
            alt={title}
          />
        )}

        {/* 🔥 Thumbnails (Between Image & Title) */}
        {imagesArray.length > 1 && (
          <div className="thumbnail-container">
            {imagesArray.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`thumb ${
                  selectedImage === img ? "active-thumb" : ""
                }`}
                alt="thumbnail"
              />
            ))}
          </div>
        )}

        {/* 🔥 Title */}
        <h2 className="mt-3">{title}</h2>

        {/* ⭐ Price */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: "#fe3d00",
              fontSize: "26px",
              fontWeight: "700",
            }}
          >
            ₹{price}
          </span>

          {originalPrice && (
            <span
              style={{
                fontSize: "18px",
                textDecoration: "line-through",
                color: "#777",
              }}
            >
              ₹{originalPrice}
            </span>
          )}
        </div>

        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          {expanded ? longDesc : shortDesc}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            color: "#fe3d00",
            border: "none",
            fontWeight: "600",
          }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

        {/* 🔥 Buttons */}
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

        {/* 🔥 Related */}
        <h3 className="mt-5 text-capitalize">
          More from {fromCategory}
        </h3>

        <Nwmasonry
          images={relatedImages}
          categoryName={fromCategory}
        />

      </div>
    </div>
  );
}