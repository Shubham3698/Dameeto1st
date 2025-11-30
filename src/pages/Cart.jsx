import React, { useContext } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import WhatsAppBtn from "../components/Watspp";
import { CartContext } from "../contexAndhooks/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // ✅ Dynamic message
  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return "Hi! I have a query about your products.";
    
    let msg = "Hi! I want to order the following items:\n";
    let total = 0;
    
    cartItems.forEach((item, index) => {
      msg += `${index + 1}. ${item.title} - Quantity: ${item.quantity} - Price: ₹${item.price * item.quantity}\n`;
      total += item.price * item.quantity;
    });
    
    msg += `Total Price: ₹${total}`;
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
                <p style={{ margin: 0 }}>₹{item.price}</p>
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

        {/* ✅ WhatsApp button hamesha visible */}
        <WhatsAppBtn phone="7080981033" message={generateWhatsAppMessage()} />
      </Container>
    </div>
  );
}
