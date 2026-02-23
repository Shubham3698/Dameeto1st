import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart } = useContext(CartContext);
  const cartEndRef = useRef(null);
  const prevCartLengthRef = useRef(cartItems.length);

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length > prevCartLengthRef.current) {
      cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCartLengthRef.current = cartItems.length;
  }, [cartItems]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
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

  const generateWhatsAppMessage = () => {
    let msg = "Hello 👋\n\nI have placed an order for the following items:\n\n";
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.title} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    msg += `\nSubtotal: ₹${subtotal}`;
    if (discountPercent > 0) msg += `\nDiscount (${discountPercent}%): -₹${discountAmount}`;
    msg += `\nFinal Total: ₹${finalTotal}\n\nPlease confirm. 🚀\nThank you!`;
    return msg;
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    setLoading(true);
    const message = generateWhatsAppMessage();

    try {
      const res = await fetch("https://serdeptry1st.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cartItems,
          subtotal,
          discountPercent,
          finalTotal,
          message,
        }),
      });

      if (res.ok) {
        alert("✅ Order placed successfully!");
        clearCart();
        window.location.href =
          "https://wa.me/917080981033?text=" + encodeURIComponent(message);
      } else {
        alert("❌ Error placing order");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error placing order");
      setLoading(false);
    }
  };

  return (
    <Container style={{ paddingTop: "20px", maxWidth: "900px" }}>
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        cartItems.map((item, index) => (
          <Row
            key={index}
            className="align-items-center py-3"
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "10px",
              padding: "10px 0",
            }}
          >
            <Col xs={3} md={2}>
              <Image src={item.src} fluid rounded style={{ borderRadius: "12px" }} />
            </Col>

            <Col xs={5} md={6}>
              <h5 style={{ fontWeight: "700", fontSize: "1.15rem", marginBottom: "6px" }}>
                {item.title}
              </h5>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "700", color: "#fe3d00", fontSize: "1.05rem" }}>
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#777",
                      fontSize: "0.9rem",
                    }}
                  >
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
            </Col>

            <Col xs={4} md={2} className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => updateQuantity(index, -1)}
                style={{ borderRadius: "50%", width: "30px", height: "30px", padding: "0" }}
              >
                –
              </Button>
              <span style={{ fontWeight: "700", fontSize: "1rem" }}>{item.quantity}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => updateQuantity(index, 1)}
                style={{ borderRadius: "50%", width: "30px", height: "30px", padding: "0" }}
              >
                +
              </Button>
            </Col>
          </Row>
        ))
      )}

      <div ref={cartEndRef}></div>

      {cartItems.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <h4 style={{ fontWeight: "700", marginBottom: "15px" }}>Order Summary</h4>

          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {discountPercent > 0 && (
            <div className="d-flex justify-content-between text-success mb-2">
              <span>Discount ({discountPercent}%)</span>
              <span>- ₹{discountAmount}</span>
            </div>
          )}

          <hr />

          <div
            className="d-flex justify-content-between"
            style={{ fontWeight: "700", fontSize: "1.2rem" }}
          >
            <span>Total</span>
            <span style={{ color: "#fe3d00" }}>₹{finalTotal}</span>
          </div>

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
            <Button
              style={{ backgroundColor: "#fe3d00", border: "none", fontWeight: "700" }}
              onClick={applyCoupon}
            >
              Apply
            </Button>
          </div>

          <Button
            onClick={placeOrder}
            disabled={loading}
            style={{
              marginTop: "20px",
              backgroundColor: loading ? "#999" : "#fe3d00",
              color: "#fff",
              padding: "10px 20px",
              fontWeight: "700",
            }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      )}

      <WhatsAppBtn phone="7080981033" message={generateWhatsAppMessage()} />
    </Container>
  );
}