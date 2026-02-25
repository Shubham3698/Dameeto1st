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

  /* 🔥 All Products */
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

  /* 🔥 Find Item */
  const item = useMemo(() => {
    if (location.state?.item) return location.state.item;

    return allProducts.find(
      (p) => String(p.id) === String(id)
    );
  }, [id, location.state, allProducts]);

  /* 🔥 Images Array */
  const imagesArray = useMemo(() => {
    if (!item) return [];

    if (item.subImages?.length > 0) {
      return [item.src, ...item.subImages];
    }

    return item.src ? [item.src] : [];
  }, [item]);

  /* 🔥 Scroll + Fade */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFadeIn(true);
  }, [id]);

  /* 🔥 Default Image */
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

  /* 🛒 Add to Cart */
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

  /* 🔗 Share Function */
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check this out: ${title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log("Sharing failed", error);
    }
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
      <style>{`
        .main-image-wrapper {
          position: relative;
        }

        .main-image {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .share-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: 0.2s ease;
        }

        .share-btn:hover {
          transform: scale(1.1);
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
        
        {selectedImage && (
          <div className="main-image-wrapper">
            <img
              src={selectedImage}
              className="main-image"
              alt={title}
            />

            {/* 🔗 Share Icon */}
            <div className="share-btn" onClick={handleShare}>
              <FaShareAlt color="#fe3d00" size={18} />
            </div>
          </div>
        )}

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

        <h2 className="mt-3">{title}</h2>

        <div style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{
            color: "#fe3d00",
            fontSize: "26px",
            fontWeight: "700"
          }}>
            ₹{price}
          </span>

          {originalPrice && (
            <span style={{
              fontSize: "18px",
              textDecoration: "line-through",
              color: "#777"
            }}>
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
            cursor: "pointer"
          }}
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
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            <FaHeart />
          </button>
        </div>

        <h3 className="mt-5 text-capitalize">
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