import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShareAlt, FaPlay } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";
import { WishlistContext } from "../contexAndhooks/WishlistContext"; // 🔥 Context Import

import CustomerProof from "../components/CustomerProof";
import { FaWhatsapp } from "react-icons/fa";

import {
  trendingData,
  stickerData,
  posterData,
  goodiesData,
  funnyData,
  hotData,
  learningProducts,
  stickerPacksData,
} from "../contexAndhooks/Ddata";

export default function ImageDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, wishlist } = useContext(WishlistContext); // 🔥 Context nikaala

  const [fadeIn, setFadeIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  
  // 🔥 NEW: State to trigger animation on carousel click
  const [mediaKey, setMediaKey] = useState(0); 

  const [dbItem, setDbItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Helpers
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("/shorts/")) videoId = url.split("/shorts/")[1].split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const decodedId = useMemo(() => {
    try { return atob(id); } catch { return id; }
  }, [id]);

  const allLocalProducts = useMemo(() => [
    ...trendingData, ...stickerData, ...posterData, ...goodiesData,
    ...funnyData, ...hotData, ...learningProducts, ...stickerPacksData,
  ], []);

  const localItem = useMemo(() => {
    if (location.state?.item) return location.state.item;
    return allLocalProducts.find((p) => String(p.id) === String(decodedId));
  }, [decodedId, location.state, allLocalProducts]);

  // 2. Fetch Logic
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
      } catch (error) { console.error("Dameeto DB Error:", error); }
      finally { setLoading(false); }
    };
    fetchFromDB();
  }, [decodedId, localItem]);

  // --- 🔥 YAHAN SUDHAAR HAI (Order ka dhyan rakhein) ---
  
  // Pehle 'item' ko define karein
  const item = localItem || dbItem;

  // Phir 'isWishlisted' check karein
  const isWishlisted = useMemo(() => {
    if (!item) return false;
    return wishlist.some((w) => String(w.id) === String(item.id));
  }, [wishlist, item]);

  const videoEmbedUrl = getEmbedUrl(item?.videoUrl);

  // --- Sudhaar khatam ---

  const handleShare = async () => {
    if (!item) return;
    const encoded = btoa(item.id);
    const shareUrl = `${window.location.origin}/image/${encoded}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: "Check this out on Dameeto 🔥", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied successfully 🚀");
      }
    } catch (error) { console.error("Share failed:", error); }
  };

  const imagesArray = useMemo(() => {
    if (!item) return [];
    return item.subImages?.length > 0 ? [item.src, ...item.subImages] : [item.src];
  }, [item]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFadeIn(true);
  }, [decodedId]);

  useEffect(() => {
    if (imagesArray.length > 0) {
      setSelectedImage(imagesArray[0]);
      setIsVideoMode(false);
    }
  }, [imagesArray]);

  // 🔥 NEW: Function to handle media change and trigger animation
  const handleMediaChange = (img, isVideo) => {
    if (!isVideo && selectedImage === img && !isVideoMode) return; // Prevent re-animating the same image
    if (isVideo && isVideoMode) return; // Prevent re-animating the same video
    
    setSelectedImage(img);
    setIsVideoMode(isVideo);
    setMediaKey(prevKey => prevKey + 1); // Changing the key restarts the CSS animation
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px", color: "#fe3d00" }}><h3>Finding your art... 🚀</h3></div>;
  if (!item) return <div style={{ textAlign: "center", marginTop: "100px" }}><h2>Product Not Found</h2></div>;

  const fromCategory = location.state?.category || item.category || "collection";
  const relatedImages = location.state?.images || [];
  const { title, shortDesc, longDesc, finalPrice, originalPrice } = item;
  const price = finalPrice ?? 199;
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "20px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease-in" }}>
      
      {/* 🔥 NEW: Inline CSS for smooth carousel transition animation */}
      <style>{`
        @keyframes mediaFadeIn {
          0% { opacity: 0.4; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* IMAGE/VIDEO VIEWER */}
        <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.2)", background: "#fff" }}>
          
          {/* 🔥 NEW: Wrapper with dynamic key to re-trigger animation */}
          <div key={mediaKey} style={{ animation: "mediaFadeIn 0.3s ease-out forwards", width: "100%", height: "100%" }}>
            {isVideoMode && videoEmbedUrl ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe src={`${videoEmbedUrl}?autoplay=1`} title="Product Video" frameBorder="0" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
              </div>
            ) : (
              selectedImage && <img src={selectedImage} style={{ width: "100%", display: "block" }} alt={title} />
            )}
          </div>

          <button onClick={handleShare} style={{ position: "absolute", top: "15px", right: "15px", background: "white", border: "none", width: "45px", height: "45px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 0 }}>
            <FaShareAlt color="#fe3d00" />
          </button>
        </div>

        {/* THUMBNAILS */}
        {(imagesArray.length > 1 || videoEmbedUrl) && (
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "15px 0" }}>
            {imagesArray.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                onClick={() => handleMediaChange(img, false)} // 🔥 Updated to use handler
                style={{ 
                  minWidth: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", cursor: "pointer", transition: "0.2s", 
                  border: !isVideoMode && selectedImage === img ? "3px solid #fe3d00" : "2px solid #ddd" 
                }} 
                alt="thumb" 
              />
            ))}
            {videoEmbedUrl && (
              <div 
                onClick={() => handleMediaChange(null, true)} // 🔥 Updated to use handler
                style={{ 
                  minWidth: "70px", height: "70px", background: "#000", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s",
                  border: isVideoMode ? "3px solid #fe3d00" : "2px solid #333", color: "white" 
                }}
              >
                <FaPlay size={20} />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>VIDEO</span>
              </div>
            )}
          </div>
        )}

        <h2 className="mt-3">{title}</h2>
        <CustomerProof customers={item?.customers || "5000+"} rating={item?.rating || "4.9"} />

        {/* PRICING */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#fe3d00", fontSize: "26px", fontWeight: "700" }}>₹{price}</span>
          {originalPrice && <span style={{ textDecoration: "line-through", color: "#777" }}>₹{originalPrice}</span>}
          {discountPercent > 0 && <span style={{ background: "#e6f7ec", color: "#2e7d32", fontSize: "12px", fontWeight: "600", padding: "4px 8px", borderRadius: "6px" }}>{discountPercent}% OFF</span>}
        </div>

        <p style={{ marginTop: "10px" }}>{expanded ? longDesc : shortDesc}</p>
        <button onClick={() => setExpanded(!expanded)} style={{ background: "transparent", color: "#fe3d00", border: "none", fontWeight: "600", cursor: "pointer" }}>{expanded ? "Show Less ▲" : "Read More ▼"}</button>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
         <button 
    // 🔥 YAHAN FIX KIYA HAI: price aur quantity explicitly add kar diye
    onClick={() => addToCart({ 
      ...item, 
      price: item.finalPrice ?? 199, // Cart 'price' dhundh raha hai, 'finalPrice' nahi
      quantity: 1 // Initial quantity 1 set karna zaroori hai
    })} 
    style={{ background: "#fe3d00", color: "white", height: "52px", padding: "0 20px", borderRadius: "50px", border: "none", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600" }}
  >
    <FaShoppingCart /> Add to Cart
  </button>

          {/* ❤️ Wishlist Button */}
          <button
            onClick={() => toggleWishlist(item)}
            style={{
              background: isWishlisted ? "#fe3d00" : "white",
              border: "2px solid #fe3d00",
              color: isWishlisted ? "white" : "#fe3d00",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.3s ease-in-out"
            }}
          >
            <FaHeart size={20} />
          </button>

          <button onClick={() => window.open(`https://wa.me/7080981033?text=${encodeURIComponent('Hi, interested in: ' + title)}`, "_blank")} style={{ background: "#25D366", border: "none", color: "white", width: "52px", height: "52px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <FaWhatsapp size={22} />
          </button>
        </div>

        <h3 style={{ marginTop: "40px" }}>More from {fromCategory}</h3>
        {relatedImages.length > 0 && <Nwmasonry images={relatedImages} categoryName={fromCategory} />}
      </div>
    </div>
  );
}