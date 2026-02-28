import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // 🔥 UPDATED: Render Backend URL
  const API_BASE_URL = "https://serdeptry1st.onrender.com";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 🔥 FIXED: Localhost ko Render URL se replace kiya
        const res = await fetch(`${API_BASE_URL}/api/customer-orders/${id}`);
        const data = await res.json();
        
        // Backend 'data' key ke andar order bhej raha hai
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        Loading order details...
      </p>
    );

  // Tracking steps definition
  const trackingSteps = ["Received", "Processing", "Shipped", "Delivered"];

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "80px 20px 40px 20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: "30px" }}>
        📦 Order Details
      </h2>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 20,
          maxWidth: 700,
          margin: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Products List */}
        <h4 style={{ marginBottom: "15px" }}>Items:</h4>
        {order.products.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              marginBottom: 10,
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p style={{ fontWeight: 700, margin: 0 }}>₹{item.price * item.quantity}</p>
          </div>
        ))}

        <hr />

        {/* Totals Section */}
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0 }}>Subtotal: ₹{order.subtotal}</p>
          {order.discount > 0 && (
            <p style={{ margin: 0, color: "green" }}>Discount: {order.discount}%</p>
          )}
          <h5 style={{ color: "#fe3d00", marginTop: 5, fontSize: "20px" }}>Total: ₹{order.total}</h5>
        </div>

        <hr />

        {/* Tracking Status UI */}
        <h4 style={{ marginBottom: "15px" }}>Order Status:</h4>
        
        {/* Agar order Cancelled hai toh Cancelled Alert dikhao */}
        {order.orderStatus === "Cancelled" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", background: "#fdeaea", borderRadius: "8px", color: "#e74c3c" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#e74c3c" }} />
            <span style={{ fontWeight: 700 }}>Your order has been Cancelled</span>
          </div>
        ) : (
          /* Normal Steps if not Cancelled */
          trackingSteps.map((step) => {
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
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                  opacity: isActive ? 1 : 0.3,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: isActive ? colors[step] : "#ccc",
                    boxShadow: isActive ? `0 0 8px ${colors[step]}` : "none",
                  }}
                />
                <span style={{ fontWeight: isActive ? 700 : 400, fontSize: "16px" }}>{step}</span>
                {step === order.orderStatus && (
                  <span style={{ fontSize: "12px", background: "#eee", padding: "2px 8px", borderRadius: "10px" }}>Current</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}