import React, { useEffect, useState } from "react";
import { FaUserCircle, FaGift, FaShoppingCart, FaHeart, FaTools, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UserAccount() {
  const navigate = useNavigate();

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  const [orderCount, setOrderCount] = useState(0);

  // 🔥 Admin Check
  const isAdmin = email === "pandey0shubham3698@gmail.com";

  const API_BASE_URL = "https://serdeptry1st.onrender.com";

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!email) return;
        const encodedEmail = encodeURIComponent(email);
        const res = await fetch(
          `${API_BASE_URL}/api/customer-orders/user/${encodedEmail}`
        );
        const data = await res.json();

        if (data.success) {
          setOrderCount(data.data.length);
        } else {
          setOrderCount(0);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        setOrderCount(0);
      }
    };
    fetchOrders();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", padding: "80px 20px 20px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <FaUserCircle style={{ fontSize: "80px", color: "#fe3d00" }} />
        <h2 style={{ marginTop: "10px", fontWeight: "700" }}>
          {name ? name : "User"} 
          {isAdmin && <span style={{ fontSize: "12px", background: "#fe3d00", padding: "2px 8px", borderRadius: "10px", marginLeft: "10px", verticalAlign: "middle", color: 'white' }}>ADMIN</span>}
        </h2>
        <p style={{ opacity: 0.7 }}>{email}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>
        
        {/* 🔥 Credits Card - Ab ye clickable hai aur game pe jayega */}
        <div style={cardStyle} onClick={() => navigate("/memory-game")}>
          <FaGift style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>0</h3>
          <p>Credits</p>
        </div>

        <div style={cardStyle} onClick={() => navigate("/view-order")}>
          <FaShoppingCart style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>{orderCount}</h3>
          <p>Orders</p>
        </div>

        <div style={cardStyle}>
          <FaHeart style={{ fontSize: "28px", color: "#fe3d00" }} />
          <h3>0</h3>
          <p>Wishlist</p>
        </div>
      </div>

      <div style={{ marginTop: "40px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
        
        {/* 🔥 ADMIN ONLY BUTTONS */}
        {isAdmin && (
          <>
            <button 
              style={{ ...actionButton, background: "#0f172a", border: "2px solid #fe3d00" }} 
              onClick={() => navigate("/inventory")}
            >
              <FaTools style={{ marginRight: "10px" }} /> Admin Inventory
            </button>

            <button 
              style={{ ...actionButton, background: "#0f172a", border: "2px solid #fe3d00", marginTop: "10px" }} 
              onClick={() => navigate("/admin-orders")}
            >
              <FaClipboardList style={{ marginRight: "10px" }} /> Admin Order Panel
            </button>
          </>
        )}

        <hr style={{ margin: "20px 0", opacity: 0.1 }} />

        <button style={actionButton}>Edit Profile</button>
        
        {/* 🔥 Top Up Credits Button - Ispe bhi game navigation laga diya hai */}
        <button style={actionButton} onClick={() => navigate("/memory-game")}>
          Top Up Credits
        </button>

        <button style={actionButton} onClick={() => navigate("/view-order")}>View Orders</button>
        <button style={actionButton} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  minWidth: "120px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const actionButton = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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