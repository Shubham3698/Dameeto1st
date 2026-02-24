import React, { useEffect } from "react";
import { FaUserCircle, FaGift, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UserAccount() {
  const navigate = useNavigate();

  // ✅ Direct localStorage se data lo
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  // ✅ Agar login nahi hai to redirect
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div
      style={{
        background: "#fff3eb",
        minHeight: "100vh",
        padding: "80px 20px 20px 20px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <FaUserCircle style={{ fontSize: "80px", color: "#fe3d00" }} />

        {/* 🔥 Login wala naam yaha show hoga */}
        <h2 style={{ marginTop: "10px", fontWeight: "700" }}>
          {name ? name : "User"}
        </h2>

        <p style={{ opacity: 0.7 }}>{email}</p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <FaGift style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>0</h3>
          <p>Credits</p>
        </div>

        <div style={cardStyle}>
          <FaShoppingCart style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>0</h3>
          <p>Orders</p>
        </div>

        <div style={cardStyle}>
          <FaHeart style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>0</h3>
          <p>Wishlist</p>
        </div>
      </div>

      {/* Actions Section */}
      <div
        style={{
          marginTop: "40px",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
      >
        <button style={actionButton}>Edit Profile</button>
        <button style={actionButton}>Top Up Credits</button>
        <button style={actionButton}>View Orders</button>
        <button style={actionButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Card style
const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  minWidth: "120px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

// Button style
const actionButton = {
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "50px",
  border: "none",
  background: "#fe3d00",
  color: "white",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
};