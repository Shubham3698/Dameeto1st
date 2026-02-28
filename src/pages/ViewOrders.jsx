import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewOrders() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://serdeptry1st.onrender.com/api/customer-orders/user/${email}`
        );

        const data = await res.json();

        if (data.success) {
          setOrders(data.data); // ✅ FIXED
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
        setOrders([]);
      }

      setLoading(false);
    };

    if (email) fetchOrders();
  }, [email]);

  return (
    <div
      style={{
        background: "#fff3eb",
        minHeight: "100vh",
        padding: "80px 20px 40px 20px",
      }}
    >
      <h2 style={{ textAlign: "center", fontWeight: "700", marginBottom: "30px" }}>
        📦 My Orders
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>

            <hr />

            {order.products.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", margin: 0 }}>
                    {item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p style={{ fontWeight: "700", margin: 0 }}>
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            <hr />

            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0 }}>
                Subtotal: ₹{order.subtotal}
              </p>

              {order.discount > 0 && (
                <p style={{ margin: 0, color: "green" }}>
                  Discount: {order.discount}%
                </p>
              )}

              <h5 style={{ color: "#fe3d00", marginTop: "5px" }}>
                Total: ₹{order.total}
              </h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
}