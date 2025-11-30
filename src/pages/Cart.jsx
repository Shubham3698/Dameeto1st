import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

export default function CartPage() {
  return (
    <div style={{ paddingTop: "20px" }}>
      <Container>
        <h2 className="mb-4">Your Cart</h2>

        {/* ITEM 1 */}
        <Row
          className="align-items-center py-3"
          style={{ borderBottom: "1px solid #ddd" }}
        >
          {/* Image */}
          <Col xs={3} md={2}>
            <Image
              src="https://i.pinimg.com/736x/07/b5/ba/07b5baed23f2a2dae59bbb37e65eff0d.jpg"
              fluid
              rounded
            />
          </Col>

          {/* Product Name + Price */}
          <Col xs={5} md={6}>
            <h5 style={{ margin: 0 }}>Sticker Pack - Type A</h5>
            <p style={{ margin: 0 }}>₹199</p>
          </Col>

          {/* Quantity */}
          <Col xs={4} md={2} className="d-flex align-items-center">
            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
              }}
            >
              –
            </button>

            <span className="mx-2">1</span>

            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
              }}
            >
              +
            </button>
          </Col>

          {/* Remove */}
          <Col xs={12} md={2} className="mt-2 mt-md-0">
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                padding: 0,
              }}
            >
              Remove
            </button>
          </Col>
        </Row>

        {/* ITEM 2 */}
        <Row
          className="align-items-center py-3"
          style={{ borderBottom: "1px solid #ddd" }}
        >
          {/* Image */}
          <Col xs={3} md={2}>
            <Image
              src="https://i.pinimg.com/736x/99/2d/6c/992d6c7631b65f0832e02396771a8aed.jpg"
              fluid
              rounded
            />
          </Col>

          {/* Product Info */}
          <Col xs={5} md={6}>
            <h5 style={{ margin: 0 }}>Sticker Pack - Type B</h5>
            <p style={{ margin: 0 }}>₹249</p>
          </Col>

          {/* Quantity */}
          <Col xs={4} md={2} className="d-flex align-items-center">
            <button style={{ background: "transparent", border: "none", fontSize: "20px" }}>–</button>
            <span className="mx-2">1</span>
            <button style={{ background: "transparent", border: "none", fontSize: "20px" }}>+</button>
          </Col>

          {/* Remove */}
          <Col xs={12} md={2} className="mt-2 mt-md-0">
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                padding: 0,
              }}
            >
              Remove
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
