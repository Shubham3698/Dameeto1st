import React, { useEffect, useState, useContext } from "react";
import { FaUserCircle, FaGift, FaShoppingCart, FaHeart, FaTools, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../contexAndhooks/WishlistContext";

export default function UserAccount() {
  const navigate = useNavigate();
  const { wishlist, fetchWishlist } = useContext(WishlistContext);

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  const [orderCount, setOrderCount] = useState(0);
  const [userCredits, setUserCredits] = useState(0);

  const isAdmin = email === "pandey0shubham3698@gmail.com";

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  useEffect(() => {
    if (!email) {
      navigate("/");
    } else {
      fetchWishlist();
    }
  }, [email, navigate, fetchWishlist]);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      const encodedEmail = encodeURIComponent(email);
      try {
        const orderRes = await fetch(`${API_BASE_URL}/api/customer-orders/user/${encodedEmail}`);
        const orderData = await orderRes.json();
        if (orderData.success) setOrderCount(orderData.data.length);

        const creditRes = await fetch(`${API_BASE_URL}/api/user-credits/${encodedEmail}`);
        if (creditRes.ok) {
          const creditData = await creditRes.json();
          if (creditData.success) setUserCredits(creditData.credits || 0);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchData();
  }, [email, API_BASE_URL]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- STYLES ---
  const cardStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "15px 5px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.01)"
  };

  const actionButton = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "16px",
    margin: "10px 0",
    borderRadius: "16px",
    border: "none",
    background: "#fe3d00",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  };

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "100px 15px 40px 15px" }}>
      
      {/* --- Profile Header (FULL CENTER) --- */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        textAlign: "center", 
        marginBottom: "35px" 
      }}>
        {/* User Icon */}
        <FaUserCircle style={{ fontSize: "100px", color: "#fe3d00", marginBottom: "15px" }} />

        {/* Name & Admin Badge Container */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "8px", 
          width: "100%" 
        }}>
          <h2 style={{ margin: 0, fontWeight: "800", fontSize: "24px", color: "#1a1a1a" }}>
            {name ? name : "Dameeto Artist"}
          </h2>
          {isAdmin && (
            <span style={{ 
              fontSize: "10px", 
              background: "#0f172a", 
              color: "white", 
              padding: "4px 10px", 
              borderRadius: "50px", 
              fontWeight: "900" 
            }}>
              ADMIN
            </span>
          )}
        </div>

        {/* Email */}
        <p style={{ opacity: 0.5, fontSize: "14px", marginTop: "5px", fontWeight: "500" }}>
          {email}
        </p>
      </div>

      {/* --- Stats Grid --- */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "10px", 
        maxWidth: "450px", 
        margin: "0 auto" 
      }}>
        <div style={cardStyle} onClick={() => navigate("/memory-game")}>
          <FaGift style={{ fontSize: "22px", color: "#fe3d00", marginBottom: "5px" }} />
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>{userCredits}</h3>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", opacity: 0.4, textTransform: "uppercase" }}>Credits</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/view-order")}>
          <FaShoppingCart style={{ fontSize: "22px", color: "#fe3d00", marginBottom: "5px" }} />
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>{orderCount}</h3>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", opacity: 0.4, textTransform: "uppercase" }}>Orders</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/wishlist")}>
          <FaHeart style={{ fontSize: "22px", color: "#fe3d00", marginBottom: "5px" }} />
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>{wishlist?.length || 0}</h3>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", opacity: 0.4, textTransform: "uppercase" }}>Wishlist</p>
        </div>
      </div>

      {/* --- Actions --- */}
      <div style={{ marginTop: "40px", maxWidth: "400px", margin: "40px auto 0 auto" }}>
        {isAdmin && (
          <div style={{ marginBottom: "20px", padding: "15px", background: "#0f172a", borderRadius: "20px" }}>
            <p style={{ color: "#fe3d00", fontSize: "10px", textAlign: "center", marginBottom: "10px", fontWeight: "800" }}>ADMIN CONTROL</p>
            <button style={{ ...actionButton, background: "rgba(255,255,255,0.05)", margin: "5px 0" }} onClick={() => navigate("/inventory")}>
              <FaTools style={{ marginRight: "10px" }} /> Inventory
            </button>
            <button style={{ ...actionButton, background: "rgba(255,255,255,0.05)", margin: "5px 0" }} onClick={() => navigate("/admin-orders")}>
              <FaClipboardList style={{ marginRight: "10px" }} /> Admin Orders
            </button>
          </div>
        )}

        <button style={{ ...actionButton, background: "white", color: "#1a1a1a", border: "1px solid #ddd" }} onClick={() => navigate("/wishlist")}>
          My Wishlist ❤️
        </button>
        <button style={actionButton} onClick={() => navigate("/view-order")}>Track Orders</button>
        <button style={{ ...actionButton, background: "transparent", color: "#fe3d00" }} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}