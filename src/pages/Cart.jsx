import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";
import AddressModal from "../components/AddressModal";
import PayModal from "../components/PayModal";
import GiftCarousel from "../components/FreeGiftCarousel"; 
import GiftUploadModal from "../components/FreeGiftAdminModal"; 

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart, addToCart } = useContext(CartContext);
  const cartEndRef = useRef(null);
  const prevCartLengthRef = useRef(cartItems.length);

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false); 
  const [tempAddress, setTempAddress] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState("");

  const email = localStorage.getItem("userEmail");
  const isAdmin = email === "pandey0shubham3698@gmail.com";

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000/api/customer-orders" 
    : "https://serdeptry1st.onrender.com/api/customer-orders";

  // 1. Scroll Effect
  useEffect(() => {
    if (cartItems.length > prevCartLengthRef.current) {
      cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCartLengthRef.current = cartItems.length;
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 🔥 AUTO-REMOVE GIFT LOGIC: Agar subtotal 299 se kam ho toh gift hatao
  useEffect(() => {
    const threshold = 299;
    // Un items ko dhundo jinka price 0 hai (Gifts)
    const hasGift = cartItems.some(item => item.price === 0);

    if (subtotal < threshold && hasGift) {
      cartItems.forEach((item, index) => {
        if (item.price === 0) {
          // Toh unki quantity khatam kar do taaki wo cart se hat jayein
          updateQuantity(index, -item.quantity);
        }
      });
    }
  }, [subtotal, cartItems, updateQuantity]);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10") { setDiscountPercent(10); alert("10% Discount Applied 🎉"); }
    else if (code === "SAVE20") { setDiscountPercent(20); alert("20% Discount Applied 🎉"); }
    else { setDiscountPercent(0); alert("Invalid Coupon ❌"); }
  };

  const generateWhatsAppMessage = (shortOrderId = "", address = null) => {
    let msg = `Hello 👋\n\nI have placed an order${shortOrderId ? ` (Order ID: ${shortOrderId})` : ""} for the following items:\n\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.title} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    msg += `\nSubtotal: ₹${subtotal}\nFinal Total: ₹${finalTotal}\n`;
    if (address) msg += `\n📍 *Address*:\n${address.fullName}, ${address.city}`;
    return msg;
  };

  const handlePlaceOrderClick = () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!email) return alert("Please login first!");
    setShowAddressModal(true);
  };

  const handleAddressSave = (addressData) => {
    const name = localStorage.getItem("userName") || "CUS";
    const generatedId = name.substring(0, 3).toUpperCase() + Date.now().toString().slice(-5);
    setCurrentOrderId(generatedId);
    setTempAddress(addressData);
    setShowAddressModal(false);
    setShowPayModal(true);
  };

  const handlePaymentComplete = async (razorpayResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortOrderId: currentOrderId,
          userName: localStorage.getItem("userName"),
          userEmail: email,
          address: tempAddress,
          products: cartItems.map(i => ({ title: i.title, price: i.price, quantity: i.quantity, image: i.src })),
          subtotal,
          total: finalTotal,
          paymentStatus: "Paid",
          ...razorpayResponse
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        window.location.href = `https://wa.me/917080981033?text=${encodeURIComponent(generateWhatsAppMessage(currentOrderId, tempAddress))}`;
      }
    } catch (err) { alert("❌ Error saving order"); } finally { setLoading(false); }
  };

  return (
    <Container style={{ paddingTop: "20px", maxWidth: "900px", paddingBottom: "50px" }}>
      {/* 🛒 Stylish Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: "800", margin: 0 }}>🛒 Your Cart</h2>
        {isAdmin && (
          <Button size="sm" variant="dark" style={{ borderRadius: "8px", padding: "5px 15px" }} onClick={() => setShowGiftModal(true)}>
            + Add Gift
          </Button>
        )}
      </div>

      {/* 1. Cart Items List */}
      <div className="mb-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-5" style={{ color: "#888", fontSize: "1.1rem" }}>Your cart is empty</p>
        ) : (
          cartItems.map((item, index) => (
            <Row key={index} className="align-items-center py-3" style={{ borderBottom: "1px solid #eee", marginBottom: "10px" }}>
              <Col xs={3} md={2}>
                <Image src={item.src} fluid rounded style={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
              </Col>
              <Col xs={5} md={6}>
                <h5 style={{ fontWeight: "700", marginBottom: "5px" }}>{item.title}</h5>
                <span style={{ fontWeight: "700", color: item.price === 0 ? "#22c55e" : "#fe3d00" }}>
                   {item.price === 0 ? "FREE GIFT 🎁" : `₹${item.price}`}
                </span>
              </Col>
              <Col xs={4} md={2} className="d-flex align-items-center justify-content-end">
                {item.price > 0 && (
                  <div className="d-flex align-items-center gap-2" style={{ background: "#f8f9fa", padding: "5px", borderRadius: "8px" }}>
                    <Button variant="link" className="p-0 text-dark" style={{ textDecoration: "none", fontWeight: "bold" }} onClick={() => updateQuantity(index, -1)}>−</Button>
                    <span style={{ fontWeight: "700", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <Button variant="link" className="p-0 text-dark" style={{ textDecoration: "none", fontWeight: "bold" }} onClick={() => updateQuantity(index, 1)}>+</Button>
                  </div>
                )}
              </Col>
            </Row>
          ))
        )}
      </div>

      {/* 2. 🔥 GIFT CAROUSEL */}
      <div className="my-4">
        <GiftCarousel 
          subtotal={subtotal} 
          cartItems={cartItems} 
          onAddGift={(gift) => addToCart({ ...gift, quantity: 1, src: gift.src })} 
          onRemoveGift={(giftTitle) => {
            const giftIndex = cartItems.findIndex(item => item.title === giftTitle);
            if (giftIndex !== -1) {
              updateQuantity(giftIndex, -cartItems[giftIndex].quantity);
            }
          }}
        />
      </div>

      <div ref={cartEndRef}></div>

      {/* 3. Order Summary Stylish Card */}
      {cartItems.length > 0 && (
        <div style={{ 
          marginTop: "30px", padding: "25px", border: "1px solid #ddd", 
          borderRadius: "15px", background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" 
        }}>
          <h4 style={{ fontWeight: "800", marginBottom: "20px" }}>Order Summary</h4>
          <div className="d-flex justify-content-between mb-2" style={{ fontSize: "1.05rem" }}>
            <span className="text-muted">Subtotal</span>
            <span style={{ fontWeight: "600" }}>₹{subtotal}</span>
          </div>
          {discountPercent > 0 && (
            <div className="d-flex justify-content-between text-success mb-2">
              <span>Discount ({discountPercent}%)</span><span>- ₹{discountAmount}</span>
            </div>
          )}
          <hr style={{ borderTop: "1px dashed #ccc" }} />
          <div className="d-flex justify-content-between align-items-center" style={{ fontWeight: "800", fontSize: "1.4rem" }}>
            <span>Total</span><span style={{ color: "#fe3d00" }}>₹{finalTotal}</span>
          </div>

          <div className="d-flex gap-2 mt-4">
            <Form.Control 
              type="text" placeholder="Apply Coupon" value={coupon} 
              onChange={(e) => setCoupon(e.target.value)} 
              style={{ borderRadius: "10px", padding: "12px" }} 
            />
            <Button 
              style={{ backgroundColor: "#000", border: "none", fontWeight: "700", borderRadius: "10px", padding: "0 25px" }} 
              onClick={applyCoupon}
            >
              Apply
            </Button>
          </div>

          <hr className="my-4" />

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "700", color: "#444" }}>Add a note (Optional):</Form.Label>
            <Form.Control 
              as="textarea" rows={3} placeholder="Special instructions for delivery..." 
              value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} 
              style={{ borderRadius: "12px", border: "1px solid #eee", background: "#fcfcfc" }} 
            />
          </Form.Group>

          <Button 
            onClick={handlePlaceOrderClick} 
            disabled={loading} 
            style={{ 
              width: "100%", backgroundColor: "#fe3d00", border: "none", padding: "16px", 
              fontWeight: "800", borderRadius: "12px", fontSize: "1.1rem",
              boxShadow: "0 8px 20px rgba(254, 61, 0, 0.3)", transition: "0.3s"
            }}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      )}

      {/* Modals & Components */}
      {showGiftModal && <GiftUploadModal onClose={() => setShowGiftModal(false)} API_BASE_URL={API_BASE_URL} />}
      <AddressModal show={showAddressModal} handleClose={() => setShowAddressModal(false)} handleSave={handleAddressSave} />
      <PayModal show={showPayModal} handleClose={() => setShowPayModal(false)} amount={finalTotal} orderId={currentOrderId} onPaymentSuccess={handlePaymentComplete} />
      <WhatsAppBtn phone="7080981033" message={generateWhatsAppMessage(currentOrderId, tempAddress)} />
    </Container>
  );
}