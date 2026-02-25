import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShareAlt } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";

import {
  trendingData,
  stickerData,
  posterData,
  goodiesData,
  funnyData,
  hotData
} from "../contexAndhooks/Ddata";

export default function ImageDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  const [fadeIn, setFadeIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  /* 🔥 Decode ID safely */
  const decodedId = useMemo(() => {
    try {
      return atob(id);
    } catch {
      return id;
    }
  }, [id]);

  /* 🔥 Combine all products */
  const allProducts = useMemo(() => {
    return [
      ...trendingData,
      ...stickerData,
      ...posterData,
      ...goodiesData,
      ...funnyData,
      ...hotData
    ];
  }, []);

  /* 🔥 Find Product */
  const item = useMemo(() => {
    if (location.state?.item) return location.state.item;

    return allProducts.find(
      (p) => String(p.id) === String(decodedId)
    );
  }, [decodedId, location.state, allProducts]);

  /* 🔥 Encode */
  const encodeId = (value) => btoa(value);

  /* 🔥 Share Function */
  const handleShare = async () => {
    if (!item) return;

    const encoded = encodeId(item.id);
    const shareUrl = `${window.location.origin}/image/${encoded}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: "Check this out on Dameeto 🔥",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied successfully 🚀");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  /* 🔥 Images */
  const imagesArray = useMemo(() => {
    if (!item) return [];

    if (item.subImages?.length > 0) {
      return [item.src, ...item.subImages];
    }

    return item.src ? [item.src] : [];
  }, [item]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFadeIn(true);
  }, [decodedId]);

  useEffect(() => {
    if (imagesArray.length > 0) {
      setSelectedImage(imagesArray[0]);
    }
  }, [imagesArray]);

  if (!item) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Product Not Found</h2>
      </div>
    );
  }

  const fromCategory = location.state?.category || "collection";
  const relatedImages = location.state?.images || [];

  const {
    title,
    shortDesc,
    longDesc,
    finalPrice,
    originalPrice
  } = item;

  const price = finalPrice ?? 199;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
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
      style={{
        background: "#fff3eb",
        minHeight: "100vh",
        padding: "20px",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-in"
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* 🔥 IMAGE WITH SHARE OVERLAY */}
        <div style={{ position: "relative" }}>
          {selectedImage && (
            <img
              src={selectedImage}
              style={{
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
              }}
              alt={title}
            />
          )}

          {/* SHARE BUTTON ON IMAGE */}
          <button
            onClick={handleShare}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "white",
              border: "none",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "pointer"
            }}
          >
            <FaShareAlt color="#fe3d00" />
          </button>
        </div>

        {/* 🔥 Thumbnails */}
        {imagesArray.length > 1 && (
          <div style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            padding: "15px 0"
          }}>
            {imagesArray.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImage(img)}
                style={{
                  minWidth: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border:
                    selectedImage === img
                      ? "3px solid #fe3d00"
                      : "2px solid #ddd"
                }}
                alt="thumbnail"
              />
            ))}
          </div>
        )}

        <h2 className="mt-3">{title}</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{
            color: "#fe3d00",
            fontSize: "26px",
            fontWeight: "700"
          }}>
            ₹{price}
          </span>

          {originalPrice && (
            <span style={{
              textDecoration: "line-through",
              color: "#777"
            }}>
              ₹{originalPrice}
            </span>
          )}
        </div>

        <p style={{ marginTop: "10px" }}>
          {expanded ? longDesc : shortDesc}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            color: "#fe3d00",
            border: "none",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

        {/* 🔥 Bottom Buttons */}
        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          <button
            onClick={handleAddToCart}
            style={{
              background: "#fe3d00",
              color: "white",
              padding: "12px 20px",
              borderRadius: "50px",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
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
              cursor: "pointer"
            }}
          >
            <FaHeart />
          </button>
        </div>

        <h3 style={{ marginTop: "40px" }}>
          More from {fromCategory}
        </h3>

        {relatedImages.length > 0 && (
          <Nwmasonry
            images={relatedImages}
            categoryName={fromCategory}
          />
        )}
      </div>
    </div>
  );
}