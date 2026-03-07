import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function PayModal({ show, handleClose, amount, orderId, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  // 🔥 Base URL updated to your Render link
  const BASE_URL = "https://serdeptry1st.onrender.com";

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // 1. Backend se Order ID mangvao - Deployed URL used here
      const { data } = await axios.post(`${BASE_URL}/api/payment/create-order`, {
        amount: amount,
      });

      const options = {
        key: "rzp_live_SOPN1D2wGhStiM", // Aapki Live Key
        amount: data.order.amount,
        currency: "INR",
        name: "Dameeto",
        description: `Payment for Order #${orderId}`,
        order_id: data.order.id,
        handler: async (response) => {
          // 2. Payment successful hone ke baad verify karo - Deployed URL used here
          try {
            const verifyRes = await axios.post(`${BASE_URL}/api/payment/verify-payment`, response);
            if (verifyRes.data.success) {
              onPaymentSuccess(response); // Response pass kar rahe hain verify-and-confirm ke liye
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Verification Failed! Please contact support.");
          }
        },
        prefill: {
          name: "Customer", 
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#fe3d00" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed! Make sure your backend is awake on Render.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0">
        <Modal.Title style={{ fontWeight: "800" }}>Final Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="mb-3">
            <span className="badge bg-light text-dark">Order ID: #{orderId}</span>
        </div>
        <p className="text-muted mb-1">Total Amount</p>
        <h2 style={{ color: "#fe3d00", fontWeight: "900", fontSize: "2.5rem" }}>₹{amount}</h2>
        
        <div className="mt-4 p-3 bg-light rounded-4">
          <p className="small text-muted mb-3">Pay securely via Cards, UPI, or Netbanking</p>
          <Button 
            onClick={handleRazorpayPayment} 
            disabled={loading}
            className="w-100 py-3 border-0 fw-bold" 
            style={{ backgroundColor: "#18181b", borderRadius: "12px" }}
          >
            {loading ? <Spinner size="sm" /> : "💳 Pay with Razorpay"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}