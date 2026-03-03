import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

export default function MobileCaseHome() {

  const products = [
    { id: 1, name: "Transparent Hard Case", price: "₹199", img: "https://i.pinimg.com/1200x/46/9f/f2/469ff2477133042ba66ef40fcd744196.jpg" },
    { id: 2, name: "Matte Silicone Case", price: "₹249", img: "https://i.pinimg.com/1200x/e2/25/01/e225015c9f0622b8a9b04c13a0101239.jpg" },
    { id: 3, name: "Shockproof Armor Case", price: "₹299", img: "https://i.pinimg.com/1200x/f3/63/da/f363da8c1c28d2da2aaa2b719f527cc6.jpg" },
    { id: 4, name: "Printed Designer Case", price: "₹229", img: "https://i.pinimg.com/736x/c5/b6/71/c5b671b7295f2aead202e72c69fd11b8.jpg" },
  ];

  const topSelling = [
    { id: 5, name: "Premium Silicone Cover", price: "₹249", img: "https://i.pinimg.com/736x/e8/25/63/e825631e1e97c9e41174f5fed952ef22.jpg" },
    { id: 6, name: "Carbon Fiber Case", price: "₹279", img: "https://i.pinimg.com/736x/66/36/d3/6636d31796ea5ddaf27ca5d84657ee84.jpg" },
    { id: 7, name: "Ultra Slim Hard Case", price: "₹199", img: "https://i.pinimg.com/736x/a8/a7/85/a8a78557e8ad370151d1b0030e359fe8.jpg" },
    { id: 8, name: "Heavy Duty Protection", price: "₹329", img: "https://i.pinimg.com/1200x/96/3e/fe/963efeedfa62d3bad9c142ae9c35ae71.jpg" },
  ];

  return (
    <div
      style={{
        background: "#f4f9ff",
        minHeight: "100vh",
        padding: "50px 0",
        margin: "20px",
        borderLeft: "5px solid #007bff",
        borderRadius: "10px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
      }}
    >
      <Container>

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: "700", color: "#111" }}>
            Mobile Hard Silicone Cases
          </h2>

          <div
            style={{
              width: "60px",
              height: "4px",
              background: "#007bff",
              margin: "12px auto",
              borderRadius: "10px"
            }}
          />

          <p style={{ color: "#555" }}>
            Premium hard & silicone protection cases for all smartphones.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={6} md={6} lg={3} className="mb-4">
              <Card
                style={{
                  borderRadius: "18px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                <Card.Img
                  variant="top"
                  src={product.img}
                  style={{
                    height: "190px",
                    objectFit: "cover"
                  }}
                />

                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "14px", fontWeight: "600" }}>
                    {product.name}
                  </Card.Title>

                  <Card.Text
                    style={{
                      fontWeight: "700",
                      color: "#007bff",
                      fontSize: "18px"
                    }}
                  >
                    {product.price}
                  </Card.Text>

           
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* TOP SELLING */}
        <div className="mt-5">
          <h4 style={{ fontWeight: "700", color: "#111" }}>
            🔥 Top Selling
          </h4>

          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "15px",
              padding: "15px 0"
            }}
          >
            {topSelling.map((item) => (
              <Card
                key={item.id}
                style={{
                  minWidth: "220px",
                  borderRadius: "18px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
                }}
              >
                <Card.Img
                  variant="top"
                  src={item.img}
                  style={{
                    height: "160px",
                    objectFit: "cover"
                  }}
                />

                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "13px", fontWeight: "600" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "700", color: "#007bff" }}>
                    {item.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center mt-4">
          <Button
            style={{
              background: "#007bff",
              border: "none",
              color: "white",
              borderRadius: "50px",
              padding: "10px 40px",
              fontWeight: "600"
            }}
          >
            View All →
          </Button>
        </div>

      </Container>
    </div>
  );
}