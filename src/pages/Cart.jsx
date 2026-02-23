import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart } =
    useContext(CartContext);

  const cartEndRef = useRef(null);
  const prevCartLengthRef = useRef(cartItems.length);

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loading, setLoading] = useState(false); // 🔥 loader state

  useEffect(() => {
    if (cartItems.length > prevCartLengthRef.current) {
      cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCartLengthRef.current = cartItems.length;
  }, [cartItems]);

  // ================= TOTAL CALCULATION =================
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  // ================= COUPON SYSTEM =================
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

  // ================= WHATSAPP MESSAGE =================
  const generateWhatsAppMessage = () => {
    let msg = "Hello 👋\n\n";
    msg += "I have placed an order for the following items:\n\n";

    cartItems.forEach((item, index) => {
      msg += `${index + 1}. ${item.title} - Qty: ${item.quantity} - Price: ₹${item.price * item.quantity}\n`;
    });

    msg += `\nSubtotal: ₹${subtotal}`;

    if (discountPercent > 0) {
      msg += `\nDiscount (${discountPercent}%): -₹${discountAmount}`;
    }

    msg += `\nFinal Total: ₹${finalTotal}\n\n`;
    msg += "Please confirm that you have received my order.\n";
    msg += "Kindly dispatch it as soon as possible. 🚀\n\n";
    msg += "Thank you!";

    return msg;
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true); // 🔥 start loader

    const message = generateWhatsAppMessage();

    try {
      const res = await fetch(
        "https://serdeptry1st.onrender.com/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      if (res.ok) {
        alert("✅ Your order is placed successfully!");
        clearCart();

        const whatsappURL =
          "https://wa.me/917080981033?text=" +
          encodeURIComponent(message);

        window.location.href = whatsappURL;
      } else {
        alert("❌ Error placing your order");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error placing your order");
      setLoading(false);
    }
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

                <div style={{ display: "flex", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#fe3d00",
                    }}
                  >
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
            </Row>
          ))
        )}

        <div ref={cartEndRef}></div>

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

            {/* COUPON SECTION */}
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

            {/* PLACE ORDER BUTTON WITH LOADER */}
            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: loading ? "#999" : "#fe3d00",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        )}

        <WhatsAppBtn
          phone="7080981033"
          message={generateWhatsAppMessage()}
        />
      </Container>
    </div>
  );
}