import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState(""); 
  const [otherReason, setOtherReason] = useState(""); 
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://serdeptry1st.onrender.com"; 

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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelRequest = async () => {
    const finalReason = cancelReason === "Other" ? otherReason : cancelReason;
    
    if (!finalReason || (cancelReason === "Other" && !otherReason.trim())) {
      return alert("Please select or provide a reason.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/cancel/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: finalReason }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Cancellation request sent! Admin will review it.");
        setShowCancelModal(false);
        fetchOrder();
      }
    } catch (err) {
      alert("Error sending request.");
    } finally {
      setLoading(false);
    }
  };

  if (!order)
    return (
      <p style={{ textAlign: "center", marginTop: "100px", fontWeight: "600" }}>
        ⌛ Loading order details...
      </p>
    );

  const trackingSteps = ["Received", "Processing", "Shipped", "Delivered"];
  const cancelOptions = ["Changed my mind", "Mistakenly ordered", "Better price elsewhere", "Other"];

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "80px 20px 40px 20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800, marginBottom: "30px", color: "#333" }}>
        📦 Order Tracking
      </h2>

      <div style={{ background: "white", borderRadius: 20, padding: 30, maxWidth: 750, margin: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        
        {/* --- Header Section --- */}
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
            <img src={item.image} alt={item.title} style={{ width: 65, height: 65, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, margin: 0, color: "#333" }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#777", fontWeight: "600" }}>₹{item.price} × {item.quantity}</p>
            </div>
            <p style={{ fontWeight: 800, margin: 0, color: "#fe3d00" }}>₹{item.price * item.quantity}</p>
          </div>
        ))}

        {/* --- Totals Section --- */}
        <div style={{ textAlign: "right", background: "#fafafa", padding: "15px", borderRadius: 15, border: "1px solid #f0f0f0" }}>
          <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Subtotal: <strong>₹{order.subtotal}</strong></p>
          {order.discount > 0 && <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#27ae60", fontWeight: "700" }}>Discount Applied: -{order.discount}%</p>}
          <h5 style={{ color: "#fe3d00", margin: 0, fontSize: "22px", fontWeight: "900" }}>Amount Paid: ₹{order.total}</h5>
        </div>

        <hr style={{ margin: "25px 0", opacity: 0.1 }} />

        {/* --- Delivery Address Section --- */}
        <h4 style={{ marginBottom: "15px", fontSize: "1.1rem", fontWeight: "800" }}>📍 Shipping To:</h4>
        {order.address ? (
          <div style={{ background: "#fff9f7", padding: "20px", borderRadius: "15px", border: "1px dashed #fe3d00", fontSize: "15px", lineHeight: "1.7" }}>
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

        {/* --- Tracking Status UI & Cancel Button --- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800" }}>🚚 Order Status:</h4>
            {/* Button only shows if not Cancelled/Delivered/Shipped/Requested */}
            {order.orderStatus !== "Cancelled" && 
             order.orderStatus !== "Delivered" && 
             order.orderStatus !== "Shipped" && 
             order.orderStatus !== "Cancel Requested" && (
                <button 
                    onClick={() => setShowCancelModal(true)}
                    style={{ background: "#fff", border: "1px solid #e74c3c", color: "#e74c3c", padding: "8px 16px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                    Request Cancellation
                </button>
            )}
        </div>
        
        {/* Yahan logic update kiya hai taaki status UI sahi dikhe */}
        {order.orderStatus === "Cancelled" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "18px", background: "#fff5f5", borderRadius: "12px", color: "#e74c3c", border: "1px solid #feb2b2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#e74c3c", boxShadow: "0 0 10px rgba(231, 76, 60, 0.4)" }} />
                <span style={{ fontWeight: 800, fontSize: "16px" }}>This order was cancelled.</span>
            </div>
            {order.cancelReason && <p style={{margin: 0, fontSize: "14px", color: "#666"}}>Reason: {order.cancelReason}</p>}
          </div>
        ) : order.orderStatus === "Cancel Requested" ? (
          <div style={{ padding: "18px", background: "#fff9eb", borderRadius: "12px", color: "#d97706", border: "1px solid #fef3c7" }}>
             <p style={{ fontWeight: 800, margin: 0, fontSize: "16px" }}>⏳ Cancellation Pending</p>
             <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Admin is reviewing your request for: "{order.cancelReason}"</p>
          </div>
        ) : (
          <div style={{ marginTop: 10, paddingLeft: "10px" }}>
            {trackingSteps.map((step, index) => {
              const currentStatusIndex = trackingSteps.indexOf(order.orderStatus);
              const thisStepIndex = trackingSteps.indexOf(step);
              const isActive = thisStepIndex <= currentStatusIndex;
              const colors = { Received: "#3498db", Processing: "#f1c40f", Shipped: "#e67e22", Delivered: "#2ecc71" };

              return (
                <div key={step} style={{ display: "flex", gap: 20, position: "relative", paddingBottom: index !== trackingSteps.length - 1 ? "30px" : "0" }}>
                  {index !== trackingSteps.length - 1 && (
                    <div style={{ position: "absolute", left: "7px", top: "20px", bottom: "0", width: "2px", background: isActive && (thisStepIndex < currentStatusIndex) ? colors[step] : "#eee" }} />
                  )}
                  <div style={{ zIndex: 2, width: 16, height: 16, borderRadius: "50%", background: isActive ? colors[step] : "#eee", boxShadow: isActive ? `0 0 12px ${colors[step]}88` : "none", marginTop: "4px" }} />
                  <div style={{ opacity: isActive ? 1 : 0.4 }}>
                    <span style={{ fontWeight: isActive ? 800 : 500, fontSize: "16px", color: isActive ? "#222" : "#888" }}>{step}</span>
                    {step === order.orderStatus && <span style={{ marginLeft: "12px", fontSize: "10px", background: "#fe3d00", color: "#fff", padding: "3px 10px", borderRadius: "20px", fontWeight: "800" }}>Current</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Cancel Modal (Vahi original vala) --- */}
      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "25px", width: "90%", maxWidth: "450px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontWeight: "800" }}>Cancel Request</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>Why do you want to cancel? Admin will review this.</p>
            <select 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", background: "#f9f9f9", outline: "none", marginBottom: "15px" }}>
              <option value="">-- Choose a reason --</option>
              {cancelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {cancelReason === "Other" && (
              <textarea 
                placeholder="Describe reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                style={{ width: "100%", height: "80px", borderRadius: "12px", border: "1px solid #ddd", padding: "12px", outline: "none", boxSizing: "border-box", resize: "none" }}
              />
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#eee", fontWeight: "700", cursor: "pointer" }}>Close</button>
              <button onClick={handleCancelRequest} disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#e74c3c", color: "white", fontWeight: "700", cursor: "pointer" }}>
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <p style={{ textAlign: "center", marginTop: "25px", color: "#888", fontSize: "14px", fontWeight: "500" }}>
        Need help? Contact support with your Order ID.
      </p>
    </div>
  );
}