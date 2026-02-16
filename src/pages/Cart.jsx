import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const cartEndRef = useRef(null);
  const prevCartLengthRef = useRef(cartItems.length);

  // ⭐ NEW STATES
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (cartItems.length > prevCartLengthRef.current) {
      cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCartLengthRef.current = cartItems.length;
  }, [cartItems]);

  // ⭐ TOTAL CALCULATION
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  // ⭐ COUPON SYSTEM
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "SAVE10") {
      setDiscountPercent(10);
      alert("10% Discount Applied 🎉");
    } 
    else if (code === "SAVE20") {
      setDiscountPercent(20);
      alert("20% Discount Applied 🎉");
    } 
    else {
      setDiscountPercent(0);
      alert("Invalid Coupon ❌");
    }
  };

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return "Hi! I have a query about your products.";

    let msg = "Hi! I want to order the following items:\n";

    cartItems.forEach((item, index) => {
      msg += `${index + 1}. ${item.title} - Qty: ${item.quantity} - Price: ₹${item.price * item.quantity}\n`;
    });

    msg += `\nSubtotal: ₹${subtotal}`;

    if (discountPercent > 0) {
      msg += `\nDiscount (${discountPercent}%): -₹${discountAmount}`;
    }

    msg += `\nFinal Total: ₹${finalTotal}`;

    return msg;
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <Container>
        <h2 className="mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <Row
              key={index}
              className="align-items-center py-3"
              style={{ borderBottom: "1px solid #ddd" }}
            >
              <Col xs={3} md={2}>
                <Image src={item.src} fluid rounded />
              </Col>

              <Col xs={5} md={6}>
                <h5 style={{ margin: 0 }}>{item.title}</h5>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px", fontWeight: "700", color: "#fe3d00" }}>
                    ₹{item.price}
                  </span>

                  {item.originalPrice && (
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#777",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>
              </Col>

              <Col xs={4} md={2} className="d-flex align-items-center">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  style={{ background: "transparent", border: "none", fontSize: "20px" }}
                >
                  –
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  style={{ background: "transparent", border: "none", fontSize: "20px" }}
                >
                  +
                </button>
              </Col>

              <Col xs={12} md={2} className="mt-2 mt-md-0">
                <button
                  onClick={() => removeFromCart(index)}
                  style={{ background: "transparent", border: "none", color: "red", padding: 0 }}
                >
                  Remove
                </button>
              </Col>
            </Row>
          ))
        )}

        <div ref={cartEndRef}></div>

        {/* ⭐ ORDER SUMMARY */}
        {cartItems.length > 0 && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              background: "#fafafa",
            }}
          >
            <h4>Order Summary</h4>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discountPercent > 0 && (
              <div className="d-flex justify-content-between text-success">
                <span>Discount ({discountPercent}%)</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}

            <hr />

            <div
              className="d-flex justify-content-between"
              style={{ fontWeight: "700", fontSize: "20px" }}
            >
              <span>Total</span>
              <span style={{ color: "#fe3d00" }}>₹{finalTotal}</span>
            </div>

            {/* Coupon */}
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button
                onClick={applyCoupon}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "8px",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        <WhatsAppBtn phone="7080981033" message={generateWhatsAppMessage()} />
      </Container>
    </div>
  );
}
