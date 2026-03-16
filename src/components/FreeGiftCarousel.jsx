import React, { useState, useEffect } from "react";
import { Image, Button } from "react-bootstrap";

const GiftCarousel = ({ subtotal, cartItems = [], onAddGift, onRemoveGift }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const threshold = 299;
  const remaining = threshold - subtotal;
  const progressPercent = Math.min((subtotal / threshold) * 100, 100);
  const isLocked = subtotal < threshold;

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000/api/free-gifts" 
    : "https://serdeptry1st.onrender.com/api/free-gifts";

  // 1. Fetch Gifts from API
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get-all`);
        const data = await res.json();
        if (data.success) setGifts(data.gifts);
      } catch (err) { console.error("Fetch Gifts Error:", err); }
      finally { setLoading(false); }
    };
    fetchGifts();
  }, [API_BASE_URL]);

  // 🔥 AUTO-SYNC: Agar amount kam ho jaye, toh carousel se bhi removal ensure karein
  useEffect(() => {
    if (isLocked) {
      gifts.forEach(gift => {
        const isInCart = cartItems.some(item => item.title === gift.title);
        if (isInCart) {
          onRemoveGift(gift.title);
        }
      });
    }
  }, [isLocked, cartItems, gifts, onRemoveGift]);

  if (loading || gifts.length === 0) return null;

  return (
    <div style={{ background: "#fffdec", padding: "15px", borderRadius: "15px", border: "1px solid #f9eeb2", margin: "20px 0" }}>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ fontSize: "13px", fontWeight: "700" }}>
            {isLocked ? `Add items worth ₹${remaining} more` : "🎁 Gift Unlocked!"}
          </span>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#fe3d00" }}>₹{threshold}</span>
        </div>
        <div style={{ height: "5px", width: "100%", background: "#e0e0e0", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, background: isLocked ? "#f3ac30" : "#22c55e", transition: "0.6s ease" }} />
        </div>
      </div>

      <div className="d-flex overflow-x-auto gap-3 pb-2 no-scrollbar" style={{ display: "flex", overflowX: "auto", gap: "12px", scrollbarWidth: 'none' }}>
        {gifts.map((gift) => {
          const isInCart = Array.isArray(cartItems) && cartItems.some(item => item.title === gift.title);
          
          return (
            <div key={gift._id} style={{ 
              minWidth: "290px", background: "#fff", borderRadius: "12px", padding: "10px", 
              display: "flex", flexDirection: "row", alignItems: "center",
              border: isInCart ? "2px solid #fe3d00" : "1px solid #eee", position: "relative"
            }}>
              <div style={{ width: "75px", height: "75px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, marginRight: "12px" }}>
                <img src={gift.src} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isLocked ? 0.6 : 1 }} alt="gift" />
              </div>

              <div style={{ flex: 1 }}>
                <h6 style={{ fontSize: "14px", fontWeight: "800", margin: "0" }}>{gift.title}</h6>
                <div style={{ background: "#fff3cd", color: "#856404", fontSize: "9px", fontWeight: "900", padding: "2px 8px", borderRadius: "5px", display: "inline-block", margin: "5px 0" }}>
                  FREE REWARD
                </div>
                <div className="d-flex justify-content-end">
                  <Button 
                    size="sm" 
                    variant={isLocked ? "light" : (isInCart ? "danger" : "outline-primary")} 
                    style={{ fontSize: "11px", fontWeight: "800" }} 
                    disabled={isLocked}
                    onClick={() => isInCart ? onRemoveGift(gift.title) : onAddGift(gift)}
                  >
                    {isLocked ? "LOCKED" : (isInCart ? "REMOVE" : "ADD")}
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