import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShareAlt, FaPlay, FaWhatsapp } from "react-icons/fa";
import Nwmasonry from "../components/Nwmasonry";
import CustomerProof from "../components/CustomerProof";
import { CartContext } from "../contexAndhooks/CartContext";
import { WishlistContext } from "../contexAndhooks/WishlistContext";

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

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px", color: "#fe3d00", fontFamily: "sans-serif" }}><h3>Finding your art... 🚀</h3></div>;
  if (!item) return <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}><h2>Product Not Found</h2></div>;

  const fromCategory = location.state?.category || item.category || "collection";
  const relatedImages = location.state?.images || [];
  const { title, shortDesc, longDesc, finalPrice, originalPrice } = item;
  const price = finalPrice ?? 199;
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    /* Fix 1: Removed width: "100vw", replaced with width: "100%" to stop scrollbar width causing trim */
    <div style={{ background: "#ffffff", minHeight: "100vh", opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease-in", fontFamily: "Inter, sans-serif", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      
      {/* 🚀 FIXED MOBILE RESPONSIVE CSS 🚀 */}
      <style>{`
        /* Global CSS reset for this component to prevent any horizontal scroll */
        .product-wrapper-master * { box-sizing: border-box !important; }
        
        img, iframe, video { max-width: 100%; } /* Fixes media breaking layout */

        .product-container { 
          width: 100%; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 20px 15px; 
          overflow-x: hidden;
        }
        
        .product-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 24px; 
          width: 100%;
        }
        
        @media (min-width: 850px) {
          .product-container { padding: 40px 20px; }
          .product-grid { grid-template-columns: 1fr 1fr; gap: 60px; }
          .media-column { position: sticky; top: 40px; align-self: start; }
        }

        @keyframes mediaFadeIn {
          0% { opacity: 0.6; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .media-main {
          position: relative; width: 100%; border-radius: 20px; overflow: hidden; 
          background: #f8f9fa; 
        }
        
        @media (min-width: 850px) {
          .media-main { border-radius: 24px; }
        }

        .thumb-scroll::-webkit-scrollbar { height: 0px; background: transparent; }
        .thumb-scroll { 
          scrollbar-width: none; 
          -webkit-overflow-scrolling: touch; 
          width: 100%; 
        } 

        .btn-cart {
          background: #fe3d00; color: white; height: 56px; padding: 0 15px; border-radius: 14px;
          border: none; display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; font-weight: 700; font-size: clamp(14px, 4vw, 16px); transition: all 0.2s ease;
          flex: 1 1 100%; /* Will take full width if needed on extreme small screens */
          min-width: 0; 
          white-space: nowrap;
        }
        @media (min-width: 360px) {
           .btn-cart { flex: 1 1 auto; }
        }

        .btn-cart:hover { background: #e03600; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(254, 61, 0, 0.2); }

        .btn-icon {
          width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
        }
        .btn-icon:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }

        .rich-section { padding-left: 12px; border-left: 3px solid #f0f0f0; margin-bottom: 20px; transition: border-color 0.3s; width: 100%; }
        @media (min-width: 850px) {
          .rich-section { padding-left: 16px; margin-bottom: 24px; }
        }
        .rich-section:hover { border-left-color: #fe3d00; }
        
        /* Stronger text wrap fix */
        .text-wrap-fix { 
          word-wrap: break-word; 
          overflow-wrap: break-word; 
          word-break: break-word; 
          width: 100%; 
          max-width: 100%; 
        }
      `}</style>

      <div className="product-wrapper-master" style={{ width: "100%", overflowX: "hidden" }}>
        <div className="product-container">
          <div className="product-grid">
            
            {/* ======================= */}
            {/* LEFT COLUMN: MEDIA      */}
            {/* ======================= */}
            <div className="media-column" style={{ width: "100%" }}>
              <div className="media-main">
                <div key={mediaKey} style={{ animation: "mediaFadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {isVideoMode && videoEmbedUrl ? (
                    <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0 }}>
                      <iframe src={`${videoEmbedUrl}?autoplay=1`} title="Product Video" frameBorder="0" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
                    </div>
                  ) : (
                    selectedImage && <img src={selectedImage} style={{ width: "100%", height: "auto", objectFit: "contain", maxHeight: "60vh", display: "block" }} alt={title} />
                  )}
                </div>

                <button onClick={handleShare} style={{ position: "absolute", top: "15px", right: "15px", background: "#fff", border: "1px solid #eaeaea", width: "42px", height: "42px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", zIndex: 10 }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <FaShareAlt size={16} color="#fe3d00" />
                </button>
              </div>

              {(imagesArray.length > 1 || videoEmbedUrl) && (
                <div className="thumb-scroll" style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "12px 0", marginTop: "4px" }}>
                  {imagesArray.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      onClick={() => handleMediaChange(img, false)}
                      style={{
                        minWidth: "70px", height: "70px", objectFit: "cover", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease",
                        border: !isVideoMode && selectedImage === img ? "2px solid #fe3d00" : "2px solid transparent",
                        opacity: !isVideoMode && selectedImage === img ? 1 : 0.6,
                        background: "#f8f9fa"
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = 1}
                      onMouseOut={e => !(!isVideoMode && selectedImage === img) && (e.currentTarget.style.opacity = 0.6)}
                      alt={`thumbnail ${index + 1}`}
                    />
                  ))}
                  {videoEmbedUrl && (
                    <div
                      onClick={() => handleMediaChange(null, true)}
                      style={{
                        minWidth: "70px", height: "70px", background: "#f0f0f0", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease",
                        border: isVideoMode ? "2px solid #fe3d00" : "2px solid transparent", color: "#333",
                        opacity: isVideoMode ? 1 : 0.7
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = 1}
                      onMouseOut={e => !isVideoMode && (e.currentTarget.style.opacity = 0.7)}
                    >
                      <FaPlay size={16} color={isVideoMode ? "#fe3d00" : "#555"} />
                      <span style={{ fontSize: "10px", marginTop: "6px", fontWeight: "700", letterSpacing: "0.5px" }}>VIDEO</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ======================= */}
            {/* RIGHT COLUMN: DETAILS   */}
            {/* ======================= */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
              
              <div style={{ width: "100%" }}>
                <CustomerProof customers={item?.customers || "5000+"} rating={item?.rating || "4.9"} />
                <h1 className="text-wrap-fix" style={{ fontSize: "clamp(24px, 6vw, 40px)", fontWeight: "800", color: "#111", margin: "12px 0 16px 0", lineHeight: "1.2", letterSpacing: "-0.5px" }}>
                  {title}
                </h1>
                
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", width: "100%" }}>
                  <span style={{ color: "#fe3d00", fontSize: "clamp(26px, 6vw, 36px)", fontWeight: "800", letterSpacing: "-1px" }}>₹{price}</span>
                  {originalPrice && <span style={{ textDecoration: "line-through", color: "#a0a0a0", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "500" }}>₹{originalPrice}</span>}
                  {discountPercent > 0 && <span style={{ background: "#fe3d0015", color: "#fe3d00", fontSize: "13px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px", whiteSpace: "nowrap" }}>{discountPercent}% OFF</span>}
                </div>

                <p className="text-wrap-fix" style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: "1.6", margin: 0, fontWeight: "400" }}>
                  {shortDesc}
                </p>
              </div>

              {/* Action Buttons - Fully wrapped for safety */}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap", width: "100%" }}>
                <button
                  className="btn-cart"
                  onClick={() => addToCart({ ...item, price: item.finalPrice ?? 199, quantity: 1 })}
                >
                  <FaShoppingCart size={18} /> Add to Cart
                </button>

                <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap" }}>
                  <button
                    className="btn-icon"
                    onClick={() => toggleWishlist(item)}
                    style={{
                      background: isWishlisted ? "#fe3d00" : "#fff",
                      border: isWishlisted ? "1px solid #fe3d00" : "1px solid #ddd",
                      color: isWishlisted ? "white" : "#555",
                    }}
                  >
                    <FaHeart size={20} />
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => window.open(`https://wa.me/7080981033?text=${encodeURIComponent('Hi, interested in: ' + title)}`, "_blank")}
                    style={{ background: "#fff", color: "#25D366", border: "1px solid #ddd" }}
                  >
                    <FaWhatsapp size={24} />
                  </button>
                </div>
              </div>

              {/* 🔥 SEAMLESS RICH CONTENT SECTION 🔥 */}
              <div style={{ marginTop: "16px", width: "100%" }}>
                
                <div style={{ transition: "all 0.4s ease", overflow: "hidden", width: "100%" }}>
                  {expanded ? (
                    item.richContent && item.richContent.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", width: "100%" }}>
                        {longDesc && <p className="text-wrap-fix" style={{ color: "#4a4a4a", whiteSpace: "pre-wrap", lineHeight: "1.7", fontSize: "15px", marginBottom: "20px" }}>{longDesc}</p>}

                        {item.richContent.map((section, idx) => (
                          <div key={idx} className="rich-section">
                            {section.heading && <h4 className="text-wrap-fix" style={{ margin: "0 0 10px 0", color: "#111", fontSize: "18px", fontWeight: "700" }}>{section.heading}</h4>}
                            
                            {section.text && <p className="text-wrap-fix" style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#555", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{section.text}</p>}
                            
                            {section.videoUrl && getEmbedUrl(section.videoUrl) && (
                              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "14px", borderRadius: "12px", overflow: "hidden", background: "#000", width: "100%" }}>
                                <iframe src={getEmbedUrl(section.videoUrl)} title={section.heading || "Feature Video"} frameBorder="0" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
                              </div>
                            )}

                            {section.image && !section.videoUrl && (
                              <img src={section.image} alt={section.heading || "Feature"} style={{ width: "100%", borderRadius: "12px", objectFit: "cover", marginBottom: "14px" }} />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-wrap-fix" style={{ marginTop: "16px", lineHeight: "1.7", color: "#4a4a4a", whiteSpace: "pre-wrap", fontSize: "15px" }}>{longDesc}</p>
                    )
                  ) : null}
                </div>

                <button
                  onClick={() => setExpanded(!expanded)}
                  style={{ 
                    background: "transparent", color: "#fe3d00", border: "none", fontWeight: "600", 
                    cursor: "pointer", padding: "8px 0", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px",
                    borderBottom: "2px solid transparent", transition: "all 0.2s ease"
                  }}
                  onMouseOver={e => e.currentTarget.style.borderBottom = "2px solid #fe3d00"}
                  onMouseOut={e => e.currentTarget.style.borderBottom = "2px solid transparent"}
                >
                  {expanded ? "Show Less ▲" : "Read Full Description ▼"}
                </button>
              </div>

            </div>
          </div>

          {/* ======================= */}
          {/* BOTTOM: RELATED ITEMS   */}
          {/* ======================= */}
          {relatedImages.length > 0 && (
            <div style={{ marginTop: "70px", width: "100%" }}>
              <h3 className="text-wrap-fix" style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: "800", color: "#111", marginBottom: "30px", letterSpacing: "-0.5px" }}>
                Explore More from {fromCategory}
              </h3>
              <div style={{ width: "100%", overflowX: "hidden" }}>
                <Nwmasonry images={relatedImages} categoryName={fromCategory} />
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}