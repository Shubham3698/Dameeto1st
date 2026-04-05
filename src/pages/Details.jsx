import React, {
  useState,
  useEffect,
  useContext,
  useMemo
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShareAlt, FaPlay } from "react-icons/fa"; // FaPlay add kiya
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";

import {
  trendingData,
  stickerData,
  posterData,
  goodiesData,
  funnyData,
  hotData,
  learningProducts
} from "../contexAndhooks/Ddata";

export default function ImageDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  const [fadeIn, setFadeIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false); // 🔥 Video mode state

  // 🔥 New states for DB data
  const [dbItem, setDbItem] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔥 YouTube Embed URL Generator (Safe Logic) */
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  /* 🔥 Decode ID safely */
  const decodedId = useMemo(() => {
    try {
      return atob(id);
    } catch {
      return id;
    }
  }, [id]);

  /* 🔥 Combine all LOCAL products */
  const allLocalProducts = useMemo(() => {
    return [
      ...trendingData,
      ...stickerData,
      ...posterData,
      ...goodiesData,
      ...funnyData,
      ...hotData,
      ...learningProducts
    ];
  }, []);

  /* 🔥 1. Check Local/State First */
  const localItem = useMemo(() => {
    if (location.state?.item) return location.state.item;
    return allLocalProducts.find(
      (p) => String(p.id) === String(decodedId)
    );
  }, [decodedId, location.state, allLocalProducts]);

  /* 🔥 2. Fetch from DB if not found in Local/State */
  useEffect(() => {
    const fetchFromDB = async () => {
      if (localItem) return;

      setLoading(true);
      try {
        const response = await fetch(`https://serdeptry1st.onrender.com/api/products/single/${decodedId}`);
        if (response.ok) {
          const data = await response.json();
          setDbItem(data);
        }
      } catch (error) {
        console.error("Dameeto DB Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFromDB();
  }, [decodedId, localItem]);

  /* 🔥 Final Item Selection */
  const item = localItem || dbItem;
  const videoEmbedUrl = getEmbedUrl(item?.videoUrl);

  /* 🔥 Encode (For sharing) */
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
      setIsVideoMode(false); // Reset video mode when item changes
    }
  }, [imagesArray]);

  // Loading UI
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#fe3d00" }}>
        <h3>Finding your art... 🚀</h3>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Product Not Found</h2>
        <p>Hume ye art database mein nahi mila.</p>
      </div>
    );
  }

  const fromCategory = location.state?.category || item.category || "collection";
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
      src: item.src,
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

        {/* 🔥 MAIN VIEW (IMAGE OR VIDEO PLAYER) */}
        <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>
          {isVideoMode && videoEmbedUrl ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`${videoEmbedUrl}?autoplay=1`}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          ) : (
            selectedImage && (
              <img
                src={selectedImage}
                style={{ width: "100%", display: "block" }}
                alt={title}
              />
            )
          )}

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
              cursor: "pointer",
              zIndex: 10
            }}
          >
            <FaShareAlt color="#fe3d00" />
          </button>
        </div>

        {/* 🔥 THUMBNAILS (IMAGES + VIDEO TRIGGER) */}
        {(imagesArray.length > 1 || videoEmbedUrl) && (
          <div style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            padding: "15px 0"
          }}>
            {/* Render Images */}
            {imagesArray.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => {
                  setSelectedImage(img);
                  setIsVideoMode(false);
                }}
                style={{
                  minWidth: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: (!isVideoMode && selectedImage === img)
                      ? "3px solid #fe3d00"
                      : "2px solid #ddd"
                }}
                alt="thumbnail"
              />
            ))}

            {/* 🔥 Video Thumbnail Button */}
            {videoEmbedUrl && (
              <div 
                onClick={() => setIsVideoMode(true)}
                style={{
                  minWidth: "70px",
                  height: "70px",
                  background: "#000",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: isVideoMode ? "3px solid #fe3d00" : "2px solid #333",
                  color: "white"
                }}
              >
                <FaPlay size={20} />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>VIDEO</span>
              </div>
            )}
          </div>
        )}

        <h2 className="mt-3">{title}</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ color: "#fe3d00", fontSize: "26px", fontWeight: "700" }}>
            ₹{price}
          </span>

          {originalPrice && (
            <span style={{ textDecoration: "line-through", color: "#777" }}>
              ₹{originalPrice}
            </span>
          )}
        </div>

        <p style={{ marginTop: "10px" }}>
          {expanded ? longDesc : shortDesc}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "transparent", color: "#fe3d00", border: "none", fontWeight: "600", cursor: "pointer" }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>

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