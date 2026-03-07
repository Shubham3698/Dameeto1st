import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";

export default function PayModal({ show, handleClose, amount, orderId, onPaymentSuccess }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // UPI Configuration with Note
  const upiId = "pandey0shubham3698@okhdfcbank";
  const upiName = "Shubham Pandey";
  // Adding Transaction Note for the customer
  const transactionNote = `Dameeto Order Payment #${orderId}`;
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

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

  const handleShareUPI = async () => {
    const shareText = `🛒 Dameeto Order #${orderId}\n💰 Amount: ₹${amount}\n🔗 Pay Link: ${upiLink}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Payment for Dameeto",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(upiLink);
        alert("UPI Link copied to clipboard! 🚀");
      }
    } catch (error) {
      navigator.clipboard.writeText(upiLink);
      alert("UPI Link copied to clipboard! 🚀");
    }
  };

  const handlePayClick = () => {
    setPaymentInitiated(true);
    setTimeLeft(20);
    window.location.href = upiLink;
  };

  const handleConfirm = () => {
    setIsConfirming(true);
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
    <Modal show={show} onHide={onModalHide} centered backdrop="static" keyboard={false} style={{ zIndex: "10002" }}>
      <Modal.Header closeButton={!isConfirming && timeLeft === 0} className="border-0 pb-0">
        <Modal.Title style={{ fontWeight: "800", color: "#18181b" }}>Complete Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
        <div className="mb-3">
            <span className="badge bg-light text-dark" style={{fontSize: '0.8rem'}}>Order ID: #{orderId}</span>
        </div>
        <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>Total Payable Amount</p>
        <h2 style={{ color: "#fe3d00", fontWeight: "900", fontSize: "2.5rem", marginBottom: "25px" }}>₹{amount}</h2>
        
        <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "15px", marginBottom: "20px" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "12px" }}>Step 1: Pay via UPI App</p>
          <div className="d-flex gap-2">
            <Button onClick={handlePayClick} disabled={paymentInitiated && timeLeft > 0} style={{ backgroundColor: "#18181b", border: "none", flex: 1, fontWeight: "700", padding: "12px", borderRadius: "10px" }}>
              {paymentInitiated && timeLeft > 0 ? `Opening App... (${timeLeft}s)` : "📱 Pay Now"}
            </Button>
            <Button onClick={handleShareUPI} style={{ backgroundColor: "white", border: "2px solid #18181b", color: "#18181b", width: "54px", borderRadius: "10px" }}>
              <FaShareAlt size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p style={{ fontSize: "0.9rem", fontWeight: "600", color: (paymentInitiated && timeLeft === 0) ? "#18181b" : "#a1a1aa", marginBottom: "12px" }}>Step 2: Confirm Payment</p>
          <Button onClick={handleConfirm} disabled={!paymentInitiated || timeLeft > 0 || isConfirming} style={{ backgroundColor: (paymentInitiated && timeLeft === 0) ? "#fe3d00" : "#ccc", border: "none", width: "100%", padding: "15px", fontWeight: "700", borderRadius: "12px" }}>
            {isConfirming ? <><Spinner size="sm" animation="border" className="me-2"/> Verifying...</> : "✅ I Have Paid"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}