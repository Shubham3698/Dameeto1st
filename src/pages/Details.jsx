import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShareAlt, FaPlay } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import { CartContext } from "../contexAndhooks/CartContext";
import { WishlistContext } from "../contexAndhooks/WishlistContext";

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
  const { toggleWishlist, wishlist } = useContext(WishlistContext);

  const [fadeIn, setFadeIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  
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
    const freshLocalItem = allLocalProducts.find((p) => String(p.id) === String(decodedId));
    if (freshLocalItem) return freshLocalItem;
    
    if (location.state?.item) return location.state.item;
    
    return null;
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

  const item = localItem || dbItem;

  const isWishlisted = useMemo(() => {
    if (!item) return false;
    return wishlist.some((w) => String(w.id) === String(item.id));
  }, [wishlist, item]);

  const videoEmbedUrl = getEmbedUrl(item?.videoUrl);

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

  const handleMediaChange = (img, isVideo) => {
    if (!isVideo && selectedImage === img && !isVideoMode) return; 
    if (isVideo && isVideoMode) return; 
    
    setSelectedImage(img);
    setIsVideoMode(isVideo);
    setMediaKey(prevKey => prevKey + 1); 
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
      
      <style>{`
        @keyframes mediaFadeIn {
          0% { opacity: 0.4; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* IMAGE/VIDEO VIEWER */}
        <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.2)", background: "#fff" }}>
          
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
                onClick={() => handleMediaChange(img, false)} 
                style={{ 
                  minWidth: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", cursor: "pointer", transition: "0.2s", 
                  border: !isVideoMode && selectedImage === img ? "3px solid #fe3d00" : "2px solid #ddd" 
                }} 
                alt="thumb" 
              />
            ))}
            {videoEmbedUrl && (
              <div 
                onClick={() => handleMediaChange(null, true)} 
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

        {/* 🔥 YAHAN SE NAYA DESCRIPTION/RICH CONTENT CHALU HOTA HAI 🔥 */}
        <div style={{ marginTop: "15px" }}>
          {expanded ? (
            item.richContent && item.richContent.length > 0 ? (
              <div className="rich-description-container" style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "15px" }}>
                {longDesc && <p style={{ color: "#444", whiteSpace: "pre-wrap" }}>{longDesc}</p>}

                {item.richContent.map((section, idx) => (
                  <div key={idx} style={{ background: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
                    
                    {/* 👇 NAYA FEATURE: AGAR VIDEO DI GAYI HAI TOH YAHAN EMBED HOGI 👇 */}
                    {section.videoUrl && getEmbedUrl(section.videoUrl) && (
                      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "12px", borderRadius: "8px", overflow: "hidden" }}>
                        <iframe 
                          src={getEmbedUrl(section.videoUrl)} 
                          title={section.heading || "Feature Video"} 
                          frameBorder="0" 
                          allowFullScreen 
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} 
                        />
                      </div>
                    )}

                    {/* AGAR IMAGE DI GAYI HAI TOH YAHAN AAYEGI */}
                    {section.image && !section.videoUrl && (
                      <img src={section.image} alt={section.heading || "Feature"} style={{ width: "100%", borderRadius: "8px", objectFit: "cover", marginBottom: "12px" }} />
                    )}

                    {section.heading && <h4 style={{ margin: "0 0 8px 0", color: "#fe3d00" }}>{section.heading}</h4>}
                    {section.text && <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{section.text}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: "10px", lineHeight: "1.6", color: "#444", whiteSpace: "pre-wrap" }}>{longDesc}</p>
            )
          ) : (
            <p style={{ marginTop: "10px", color: "#444" }}>{shortDesc}</p>
          )}
        </div>

        <button 
          onClick={() => setExpanded(!expanded)} 
          style={{ background: "transparent", color: "#fe3d00", border: "none", fontWeight: "600", cursor: "pointer", padding: "10px 0", fontSize: "15px", display: "block" }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>
        {/* 🔥 RICH CONTENT KHATAM 🔥 */}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
         <button 
            onClick={() => addToCart({ 
              ...item, 
              price: item.finalPrice ?? 199, 
              quantity: 1 
            })} 
            style={{ background: "#fe3d00", color: "white", height: "52px", padding: "0 20px", borderRadius: "50px", border: "none", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600" }}
          >
            <FaShoppingCart /> Add to Cart
          </button>

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