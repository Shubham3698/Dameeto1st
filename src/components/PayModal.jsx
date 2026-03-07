import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";

export default function PayModal({ show, handleClose, amount, onPaymentSuccess }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // UPI Configuration
  const upiId = "pandey0shubham3698@okhdfcbank";
  const upiName = "Shubham Pandey";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`;

  // Timer logic for verification feel
  useEffect(() => {
    let timer;
    if (paymentInitiated && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [paymentInitiated, timeLeft]);

  // 🔥 Fixed Share Functionality (Handles Invalid URL Error)
  const handleShareUPI = async () => {
    const shareText = `Dameeto Order Payment (₹${amount})\nClick here to pay: ${upiLink}`;
    
    try {
      if (navigator.share) {
        // Note: URL property is omitted to avoid 'Invalid URL' error with upi:// protocol
        await navigator.share({
          title: "Payment for Dameeto",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(upiLink);
        alert("UPI Link copied to clipboard! 🚀");
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback for browsers that block custom protocols in share
      navigator.clipboard.writeText(upiLink);
      alert("UPI Link copied to clipboard! 🚀");
    }
  };

  const handlePayClick = () => {
    setPaymentInitiated(true);
    setTimeLeft(20); // 20 seconds timer
    window.location.href = upiLink;
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    // Mimicking verification delay
    setTimeout(() => {
      setIsConfirming(false);
      onPaymentSuccess(); 
    }, 2000);
  };

  const onModalHide = () => {
    if (!isConfirming && timeLeft === 0) {
      setPaymentInitiated(false);
      setTimeLeft(0);
      handleClose();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onModalHide} 
      centered 
      backdrop="static" 
      keyboard={false}
      style={{ zIndex: "10002" }}
    >
      <Modal.Header closeButton={!isConfirming && timeLeft === 0} className="border-0 pb-0">
        <Modal.Title style={{ fontWeight: "800", color: "#18181b" }}>Complete Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
        <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>Total Payable Amount</p>
        <h2 style={{ color: "#fe3d00", fontWeight: "900", fontSize: "2.5rem", marginBottom: "25px" }}>
          ₹{amount}
        </h2>
        
        {/* STEP 1: Pay Now & Share */}
        <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "15px", marginBottom: "20px" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "12px" }}>
            Step 1: Pay via UPI App or Share Link
          </p>
          
          <div className="d-flex gap-2">
            <Button 
              onClick={handlePayClick} 
              disabled={paymentInitiated && timeLeft > 0}
              style={{ 
                backgroundColor: "#18181b", 
                border: "none", 
                flex: 1,
                fontWeight: "700",
                padding: "12px",
                borderRadius: "10px"
              }}
            >
              {paymentInitiated && timeLeft > 0 ? `Opening App... (${timeLeft}s)` : "📱 Pay Now"}
            </Button>

            <Button 
              onClick={handleShareUPI}
              style={{ 
                backgroundColor: "white", 
                border: "2px solid #18181b", 
                color: "#18181b",
                width: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px"
              }}
            >
              <FaShareAlt size={18} />
            </Button>
          </div>
        </div>

        {/* STEP 2: Confirm Button */}
        <div className="mt-4">
          <p style={{ 
            fontSize: "0.9rem", 
            fontWeight: "600",
            color: (paymentInitiated && timeLeft === 0) ? "#18181b" : "#a1a1aa",
            marginBottom: "12px"
          }}>
            Step 2: Confirm after successful payment
          </p>

          <Button 
            onClick={handleConfirm} 
            disabled={!paymentInitiated || timeLeft > 0 || isConfirming}
            style={{ 
              backgroundColor: (paymentInitiated && timeLeft === 0) ? "#fe3d00" : "#ccc",
              border: "none", 
              width: "100%", 
              padding: "15px", 
              fontWeight: "700", 
              borderRadius: "12px",
              fontSize: "1rem",
              boxShadow: (paymentInitiated && timeLeft === 0) ? "0 4px 15px rgba(254, 61, 0, 0.3)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            {isConfirming ? (
              <><Spinner size="sm" animation="border" className="me-2"/> Verifying...</>
            ) : paymentInitiated && timeLeft > 0 ? (
              `Wait ${timeLeft}s for Verification`
            ) : (
              "✅ I Have Paid / Confirm Order"
            )}
          </Button>

          {/* Warning Message Box */}
          {paymentInitiated && (
            <div className="mt-3 p-2" style={{ backgroundColor: "#fff5f5", borderRadius: "10px", border: "1px solid #feb2b2" }}>
              <small className="text-danger" style={{ fontSize: "11px", fontWeight: "700", lineHeight: "1.2", display: "block" }}>
                ⚠️ WARNING: Please ensure payment is successful before confirming. Incorrect confirmations may lead to order cancellation.
              </small>
            </div>
          )}
          
          {!paymentInitiated && (
            <small className="text-muted d-block mt-2" style={{ fontSize: "10px" }}>
              * Please click "Pay Now" to begin the process.
            </small>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}