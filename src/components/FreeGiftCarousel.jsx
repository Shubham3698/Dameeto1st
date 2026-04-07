import React, { useState, useEffect } from "react";
import { Image, Button } from "react-bootstrap";

const GiftCarousel = ({ subtotal, cartItems = [], onAddGift, onRemoveGift }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000/api/free-gifts" 
    : "https://serdeptry1st.onrender.com/api/free-gifts";

  // 📊 Progress bar ke liye max threshold nikalna
  const maxThreshold = gifts.length > 0 ? Math.max(...gifts.map(g => g.threshold || 299)) : 299;
  const progressPercent = Math.min((subtotal / maxThreshold) * 100, 100);

  // 1. Fetch Gifts from API
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        // ✅ FIX: apiBase ki jagah API_BASE_URL use kiya
        const res = await fetch(`${API_BASE_URL}/get-all`);
        const data = await res.json();
        if (data.success) setGifts(data.gifts);
      } catch (err) { 
        console.error("Fetch Gifts Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchGifts();
  }, [API_BASE_URL]);

  // 🔥 REFINED AUTO-SYNC: Har gift ko uske apne threshold ke base par check karega
  useEffect(() => {
    if (gifts.length > 0) {
      gifts.forEach(gift => {
        const giftThreshold = gift.threshold || 299;
        const isCurrentlyLocked = subtotal < giftThreshold;
        const isInCart = cartItems.some(item => item.title === gift.title);

        // Agar gift cart mein hai par subtotal kam ho gaya, toh remove karo
        if (isCurrentlyLocked && isInCart) {
          onRemoveGift(gift.title);
        }
      });
    }
  }, [subtotal, cartItems, gifts, onRemoveGift]);

  if (loading || gifts.length === 0) return null;

  return (
    <div style={{ background: "#fffdec", padding: "15px", borderRadius: "15px", border: "1px solid #f9eeb2", margin: "20px 0" }}>
      {/* 📊 Overall Progress Bar */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ fontSize: "13px", fontWeight: "700" }}>
            {subtotal < maxThreshold ? `Add ₹${maxThreshold - subtotal} more for more gifts!` : "All Gifts Unlocked! 🎁"}
          </span>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#fe3d00" }}>Target: ₹{maxThreshold}</span>
        </div>
        <div style={{ height: "6px", width: "100%", background: "#e0e0e0", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: progressPercent < 100 ? "#f3ac30" : "#22c55e", transition: "0.6s ease" }} />
        </div>
      </div>

      {/* 🎁 Gifts List */}
      <div className="d-flex overflow-x-auto gap-3 pb-2 no-scrollbar" style={{ display: "flex", overflowX: "auto", gap: "12px", scrollbarWidth: 'none' }}>
        {gifts.map((gift) => {
          const giftThreshold = gift.threshold || 299;
          const isLocked = subtotal < giftThreshold;
          const isInCart = Array.isArray(cartItems) && cartItems.some(item => item.title === gift.title);
          
          return (
            <div key={gift._id} style={{ 
              minWidth: "280px", background: "#fff", borderRadius: "12px", padding: "10px", 
              display: "flex", flexDirection: "row", alignItems: "center",
              border: isInCart ? "2px solid #fe3d00" : (isLocked ? "1px dashed #ccc" : "1px solid #eee"), 
              position: "relative",
              opacity: isLocked ? 0.7 : 1
            }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, marginRight: "12px", position: 'relative' }}>
                <img 
                  src={gift.src} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: isLocked ? "grayscale(100%)" : "none" }} 
                  alt={gift.title} 
                />
                {isLocked && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>
                    🔒
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h6 style={{ fontSize: "13px", fontWeight: "800", margin: "0" }}>{gift.title}</h6>
                
                <div style={{ 
                  background: isLocked ? "#f8f9fa" : "#fff3cd", 
                  color: isLocked ? "#666" : "#856404", 
                  fontSize: "9px", fontWeight: "900", padding: "2px 8px", borderRadius: "5px", display: "inline-block", margin: "5px 0" 
                }}>
                  {isLocked ? `UNLOCK AT ₹${giftThreshold}` : "FREE REWARD"}
                </div>

                <div className="d-flex justify-content-end mt-1">
                  <Button 
                    size="sm" 
                    variant={isLocked ? "light" : (isInCart ? "danger" : "dark")} 
                    style={{ fontSize: "10px", fontWeight: "800", padding: "4px 12px" }} 
                    disabled={isLocked}
                    onClick={() => isInCart ? onRemoveGift(gift.title) : onAddGift(gift)}
                  >
                    {isLocked ? "LOCKED" : (isInCart ? "REMOVE" : "ADD GIFT")}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GiftCarousel;