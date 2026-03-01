import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // 🔥 UPDATED: Render Backend URL for Deployment
  const API_BASE_URL = "https://serdeptry1st.onrender.com";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/customer-orders/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };
    fetchOrder();
  }, [id, API_BASE_URL]);

  if (!order)
    return (
      <p style={{ textAlign: "center", marginTop: "100px", fontWeight: "600" }}>
        ⌛ Loading order details...
      </p>
    );

  const trackingSteps = ["Received", "Processing", "Shipped", "Delivered"];

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "80px 20px 40px 20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800, marginBottom: "30px", color: "#333" }}>
        📦 Order Tracking
      </h2>

      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 30,
          maxWidth: 750,
          margin: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* --- Header Section with ID --- */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 25, borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
            <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Order ID</p>
                <span style={{ fontWeight: 800, color: "#fe3d00", fontSize: "1.1rem" }}>#{order.shortOrderId || order._id}</span>
            </div>
            <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Placed On</p>
                <span style={{ fontSize: 14, fontWeight: "700", color: "#555" }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
        </div>

        {/* --- Products List --- */}
        <h4 style={{ marginBottom: "15px", fontSize: "1.1rem", fontWeight: "800" }}>Items Ordered:</h4>
        {order.products.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 15, padding: "10px", background: "#fcfcfc", borderRadius: "12px" }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 65, height: 65, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, margin: 0, color: "#333" }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#777", fontWeight: "600" }}>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p style={{ fontWeight: 800, margin: 0, color: "#fe3d00" }}>₹{item.price * item.quantity}</p>
          </div>
        ))}

        {/* --- Totals Section --- */}
        <div style={{ textAlign: "right", background: "#fafafa", padding: "15px", borderRadius: 15, border: "1px solid #f0f0f0" }}>
          <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Subtotal: <strong>₹{order.subtotal}</strong></p>
          {order.discount > 0 && (
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#27ae60", fontWeight: "700" }}>Discount Applied: -{order.discount}%</p>
          )}
          <h5 style={{ color: "#fe3d00", margin: 0, fontSize: "22px", fontWeight: "900" }}>Amount Paid: ₹{order.total}</h5>
        </div>

        <hr style={{ margin: "25px 0", opacity: 0.1 }} />

        {/* --- Delivery Address Section --- */}
        <h4 style={{ marginBottom: "15px", fontSize: "1.1rem", fontWeight: "800" }}>📍 Shipping To:</h4>
        {order.address ? (
          <div style={{ 
            background: "#fff9f7", 
            padding: "20px", 
            borderRadius: "15px", 
            border: "1px dashed #fe3d00",
            fontSize: "15px",
            lineHeight: "1.7"
          }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "800", fontSize: "17px", color: "#222" }}>{order.address.fullName}</p>
            <p style={{ margin: "0 0 10px 0", color: "#fe3d00", fontWeight: "700" }}>📞 +91 {order.address.phone}</p>
            <p style={{ margin: 0, color: "#555", fontWeight: "500" }}>
              {order.address.street}, {order.address.city}, {order.address.state} - <strong style={{color: "#000"}}>{order.address.pincode}</strong>
            </p>
          </div>
        ) : (
          <p style={{ color: "gray", fontStyle: "italic", background: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>Address details not found.</p>
        )}

        <hr style={{ margin: "25px 0", opacity: 0.1 }} />

        {/* --- Tracking Status UI --- */}
        <h4 style={{ marginBottom: "20px", fontSize: "1.1rem", fontWeight: "800" }}>🚚 Order Status:</h4>
        
        {order.orderStatus === "Cancelled" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px", background: "#fff5f5", borderRadius: "12px", color: "#e74c3c", border: "1px solid #feb2b2" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#e74c3c", boxShadow: "0 0 10px rgba(231, 76, 60, 0.4)" }} />
            <span style={{ fontWeight: 800, fontSize: "16px" }}>This order was cancelled.</span>
          </div>
        ) : (
          <div style={{ marginTop: 10, paddingLeft: "10px" }}>
            {trackingSteps.map((step, index) => {
              const currentStatusIndex = trackingSteps.indexOf(order.orderStatus);
              const thisStepIndex = trackingSteps.indexOf(step);
              const isActive = thisStepIndex <= currentStatusIndex;

              const colors = {
                Received: "#3498db",
                Processing: "#f1c40f",
                Shipped: "#e67e22",
                Delivered: "#2ecc71",
              };

              return (
                <div key={step} style={{ display: "flex", gap: 20, position: "relative", paddingBottom: index !== trackingSteps.length - 1 ? "30px" : "0" }}>
                  {/* Vertical Line logic */}
                  {index !== trackingSteps.length - 1 && (
                    <div style={{ position: "absolute", left: "7px", top: "20px", bottom: "0", width: "2px", background: isActive && (thisStepIndex < currentStatusIndex) ? colors[step] : "#eee" }} />
                  )}
                  
                  <div
                    style={{
                      zIndex: 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: isActive ? colors[step] : "#eee",
                      boxShadow: isActive ? `0 0 12px ${colors[step]}88` : "none",
                      marginTop: "4px"
                    }}
                  />
                  <div style={{ opacity: isActive ? 1 : 0.4 }}>
                    <span style={{ fontWeight: isActive ? 800 : 500, fontSize: "16px", color: isActive ? "#222" : "#888" }}>{step}</span>
                    {step === order.orderStatus && (
                      <span style={{ marginLeft: "12px", fontSize: "10px", background: "#fe3d00", color: "#fff", padding: "3px 10px", borderRadius: "20px", fontWeight: "800", textTransform: "uppercase" }}>Current</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Help Footer */}
      <p style={{ textAlign: "center", marginTop: "25px", color: "#888", fontSize: "14px", fontWeight: "500" }}>
        Need help? Contact support with your Order ID.
      </p>
    </div>
  );
}