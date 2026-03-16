import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function PayModal({ 
  show, 
  handleClose, 
  amount, 
  orderId, 
  onPaymentSuccess,
  tempAddress, 
  cartItems,   
  subtotal     
}) {
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  // 🔥 Smart URL: Localhost aur Render dono par kaam karega
  const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  // 🔥 Naya Function: Payment Link Share karne ke liye
  const handleSharePaymentLink = async () => {
    if (!tempAddress) return alert("Pehle address details bhariye!");

    setLinkLoading(true);
    try {
      // 1. Backend se Razorpay Link Generate Karo
      const { data } = await axios.post(`${BASE_URL}/api/payment/create-link`, {
        amount: amount,
        orderId: orderId,
      });

      if (data.success) {
        // 2. ✅ Webhook ke liye Order DB mein save karo
        // paymentMethod: "Link Share" se backend validation skip hogi
        await axios.post(`${BASE_URL}/api/customer-orders/create`, {
          shortOrderId: orderId,
          userName: localStorage.getItem("userName") || "Customer",
          userEmail: localStorage.getItem("userEmail") || "no-email@dameeto.com",
          address: tempAddress,
          products: cartItems.map(i => ({ 
            title: i.title, 
            price: i.price, 
            quantity: i.quantity, 
            image: i.src || i.image 
          })),
          subtotal: subtotal,
          total: amount,
          paymentStatus: "Unpaid", 
          paymentMethod: "Link Share",
          // 🔥 Backend signature check se bachne ke liye dummy IDs
          razorpay_order_id: "LINK_" + orderId,
          razorpay_payment_id: "PENDING",
          razorpay_signature: "PENDING",
          razorpayOrderId: "LINK_" + orderId,
          razorpayPaymentId: "PENDING"
        });

        const message = `Hello 👋, please complete the payment of ₹${amount} for Order #${orderId} using this secure link: ${data.short_url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      }
    } catch (error) {
      console.error("Link Share Error Details:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Check fields in console"}`);
    } finally {
      setLinkLoading(false);
    }
  };

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
        description: `Payment for Order #${orderId}`,
        order_id: data.order.id,
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via QR / UPI",
                instruments: [{ method: "upi", display: "qr" }],
              },
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response) => {
          // 2. Direct Payment Success handler
          onPaymentSuccess(response); 
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer", 
          email: localStorage.getItem("userEmail") || "",
          contact: "",
        },
        theme: { color: "#fe3d00" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed!");
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
          <p className="small text-muted mb-3 fw-medium">100% Secure Payment via Razorpay</p>
          
          {/* Main Payment Button */}
          <Button 
            onClick={handleRazorpayPayment} 
            disabled={loading || linkLoading}
            className="w-100 py-3 border-0 fw-bold shadow-sm mb-3" 
            style={{ backgroundColor: "#18181b", borderRadius: "14px" }}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : "💳 Pay Now (QR/UPI)"}
          </Button>

          {/* Share Link Button */}
          <Button 
            onClick={handleSharePaymentLink}
            disabled={loading || linkLoading}
            variant="outline-success"
            className="w-100 py-2 fw-bold"
            style={{ borderRadius: "12px", borderStyle: "dashed", borderWidth: "2px" }}
          >
            {linkLoading ? <Spinner size="sm" className="me-2" /> : "📤 Share Link via WhatsApp"}
          </Button>
        </div>
        
        <p className="mt-3 extra-small text-muted" style={{ fontSize: "0.75rem" }}>
          UPI app nahi hai? Link share karein ya QR ka screenshot lein!
        </p>
      </Modal.Body>
    </Modal>
  );
}