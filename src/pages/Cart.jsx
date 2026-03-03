import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";
import AddressModal from "../components/AddressModal";

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart } = useContext(CartContext);
  const cartEndRef = useRef(null);
  const prevCartLengthRef = useRef(cartItems.length);

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 🔥 NEW: Customer Message State
  const [customerNote, setCustomerNote] = useState("");

  // Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Backend URL
  const API_BASE_URL = "https://serdeptry1st.onrender.com/api/customer-orders";

  useEffect(() => {
    if (cartItems.length > prevCartLengthRef.current) {
      cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCartLengthRef.current = cartItems.length;
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10") {
      setDiscountPercent(10);
      alert("10% Discount Applied 🎉");
    } else if (code === "SAVE20") {
      setDiscountPercent(20);
      alert("20% Discount Applied 🎉");
    } else {
      setDiscountPercent(0);
      alert("Invalid Coupon ❌");
    }
  };

  const generateWhatsAppMessage = (shortOrderId = "", address = null) => {
    let msg = `Hello 👋\n\nI have placed an order${
      shortOrderId ? ` (Order ID: ${shortOrderId})` : ""
    } for the following items:\n\n`;
    
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.title} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });

    msg += `\nSubtotal: ₹${subtotal}`;
    if (discountPercent > 0) msg += `\nDiscount (${discountPercent}%): -₹${discountAmount}`;
    msg += `\nFinal Total: ₹${finalTotal}\n`;

    if (address) {
      msg += `\n📍 *Delivery Address*:\n${address.fullName}\n${address.phone}\n${address.street}, ${address.city}, ${address.state} - ${address.pincode}\n`;
    }

    // 🔥 Added Customer Note to WhatsApp
    if (customerNote.trim()) {
      msg += `\n📝 *Customer Note*: ${customerNote}\n`;
    }

    msg += `\nPlease confirm. 🚀\nThank you!`;
    return msg;
  };

  const handlePlaceOrderClick = () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    const email = localStorage.getItem("userEmail");
    if (!email) return alert("Please login first!");
    
    setShowAddressModal(true);
  };

  const handleAddressSave = async (addressData) => {
    setLoading(true);
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName") || "Customer";

    try {
      const res = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: name,
          userEmail: email,
          address: addressData,
          products: cartItems.map((item) => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.src,
          })),
          subtotal: subtotal,
          discount: discountPercent,
          total: finalTotal,
          // 🔥 UPDATED: Ab static text ki jagah customer ka note database mein jayega
          message: customerNote || "No special instructions",
        }),
      });

      const data = await res.json();

      if (data.success) {
        const shortOrderId = data.data.shortOrderId;
        alert(`✅ Order placed successfully! (ID: ${shortOrderId})`);

        // WhatsApp redirect
        const whatsappUrl = `https://wa.me/917080981033?text=${encodeURIComponent(
          generateWhatsAppMessage(shortOrderId, addressData)
        )}`;
        
        clearCart();
        window.location.href = whatsappUrl;
      } else {
        alert("❌ Error: " + (data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Server Error: Check your backend status on Render.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: "20px", maxWidth: "900px", paddingBottom: "50px" }}>
      <h2 className="mb-4 text-center" style={{ fontWeight: "800" }}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        cartItems.map((item, index) => (
          <Row key={index} className="align-items-center py-3" style={{ borderBottom: "1px solid #ddd", marginBottom: "10px" }}>
            <Col xs={3} md={2}><Image src={item.src} fluid rounded style={{ borderRadius: "12px" }} /></Col>
            <Col xs={5} md={6}>
              <h5 style={{ fontWeight: "700" }}>{item.title}</h5>
              <div className="d-flex gap-2">
                <span style={{ fontWeight: "700", color: "#fe3d00" }}>₹{item.price}</span>
              </div>
            </Col>
            <Col xs={4} md={2} className="d-flex align-items-center gap-2">
              <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(index, -1)}>−</Button>
              <span style={{ fontWeight: "700" }}>{item.quantity}</span>
              <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(index, 1)}>+</Button>
            </Col>
          </Row>
        ))
      )}

      <div ref={cartEndRef}></div>

      {cartItems.length > 0 && (
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "12px", background: "#fafafa" }}>
          <h4 style={{ fontWeight: "800", marginBottom: "15px" }}>Order Summary</h4>
          <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span style={{ fontWeight: "600" }}>₹{subtotal}</span></div>
          {discountPercent > 0 && (
            <div className="d-flex justify-content-between text-success mb-2">
              <span>Discount ({discountPercent}%)</span><span>- ₹{discountAmount}</span>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between" style={{ fontWeight: "800", fontSize: "1.3rem" }}>
            <span>Total</span><span style={{ color: "#fe3d00" }}>₹{finalTotal}</span>
          </div>

          {/* Coupon Code Section */}
          <div className="mt-3 d-flex gap-2">
            <input type="text" placeholder="Coupon Code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="form-control" style={{ borderRadius: "8px" }} />
            <Button style={{ backgroundColor: "#fe3d00", border: "none", fontWeight: "700", borderRadius: "8px", padding: "0 20px" }} onClick={applyCoupon}>Apply</Button>
          </div>

          <hr className="my-4" />

          {/* 🔥 NEW: Customer Instructions Section */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "700" }}>Add a note for your order (Optional):</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="E.g. Wrap it as a gift or delivery instructions..." 
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              style={{ borderRadius: "10px", border: "1px solid #ccc" }}
            />
          </Form.Group>

          <Button 
            onClick={handlePlaceOrderClick} 
            disabled={loading} 
            style={{ 
              marginTop: "10px", 
              width: "100%", 
              backgroundColor: "#fe3d00", 
              border: "none", 
              padding: "14px", 
              fontWeight: "700", 
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(254, 61, 0, 0.2)"
            }}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      )}

      <AddressModal 
        show={showAddressModal} 
        handleClose={() => setShowAddressModal(false)} 
        handleSave={handleAddressSave} 
      />

      <WhatsAppBtn phone="7080981033" message={generateWhatsAppMessage()} />
    </Container>
  );
}