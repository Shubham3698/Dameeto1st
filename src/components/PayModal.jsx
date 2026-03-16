import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function PayModal({ show, handleClose, amount, orderId, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  // Deployed Backend URL
  const BASE_URL = "https://serdeptry1st.onrender.com";

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // 1. Backend se Razorpay Order generate karvao
      const { data } = await axios.post(`${BASE_URL}/api/payment/create-order`, {
        amount: amount,
      });

      const options = {
        key: "rzp_live_SOPN1D2wGhStiM", // Live Key
        amount: data.order.amount,
        currency: "INR",
        name: "Dameeto",
        description: `Payment for Order #${orderId}`, // 🔥 Asli ID dikhegi
        order_id: data.order.id,
        // 🔥 QR aur UPI ko upar dikhane ke liye config
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via QR / UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async (response) => {
          // 2. Payment successful! Ab CartPage ko response bhej do
          onPaymentSuccess(response); 
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer", 
          email: localStorage.getItem("userEmail") || "",
          contact: "", // Optional: User phone number
        },
        theme: { color: "#fe3d00" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed! Please check your internet or try again.");
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" className="dameeto-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontWeight: "800", fontSize: "1.5rem" }}>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="mb-4">
            <span className="px-3 py-2 rounded-pill bg-light text-secondary small fw-bold">
              Order ID: #{orderId}
            </span>
        </div>
        
        <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>Amount to Pay</p>
        <h2 style={{ color: "#fe3d00", fontWeight: "900", fontSize: "3rem", letterSpacing: "-1px" }}>
          ₹{amount}
        </h2>
        
        <div className="mt-4 p-4 bg-light rounded-4 shadow-sm border">
          <p className="small text-muted mb-3 fw-medium">
            100% Secure Payment via Razorpay
          </p>
          <Button 
            onClick={handleRazorpayPayment} 
            disabled={loading}
            className="w-100 py-3 border-0 fw-bold shadow-sm" 
            style={{ 
              backgroundColor: "#18181b", 
              borderRadius: "14px",
              transition: "all 0.2s ease" 
            }}
          >
            {loading ? (
              <><Spinner size="sm" className="me-2" /> Initializing...</>
            ) : (
              "💳 Pay Now"
            )}
          </Button>
        </div>
        <p className="mt-3 extra-small text-muted" style={{ fontSize: "0.75rem" }}>
          By paying, you agree to Dameeto's terms & conditions.
        </p>
      </Modal.Body>
    </Modal>
  );
}