import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { FaShoppingCart } from "react-icons/fa"; // Unused if not needed
import MobileCaseHome from "../components/MobileCaseHome";
import LearningProductsHome from "../components/LearningProductsHome";
import { motion } from "framer-motion"; // Framer motion import kiya

export default function DtfStickerHome() {

  const products = [
    { id: 1, name: "Cartoon DTF Sticker", price: "₹29", img: "https://i.pinimg.com/1200x/ce/73/45/ce73456e0678a01fedb443d48d561121.jpg" },
    { id: 2, name: "Logo DTF Sticker", price: "₹29", img: "https://i.pinimg.com/474x/fe/b3/1f/feb31f641f6bddd3f789a2d8666a2592.jpg" },
    { id: 3, name: "Custom Name Sticker", price: "₹29", img: "https://i.pinimg.com/736x/27/37/03/27370336be72e1d4c966bf21ee055e4d.jpg" },
    { id: 4, name: "Bike DTF Sticker", price: "₹29", img: "https://i.pinimg.com/736x/7a/31/18/7a3118860493ce5bfd53cb6bbd87e5ca.jpg" },
  ];

  const topSelling = [
    { id: 5, name: "Premium DTF", price: "₹29", img: "https://i.pinimg.com/736x/9a/59/49/9a594945716f011c8c59314eca236e5e.jpg" },
    { id: 6, name: "Holographic DTF", price: "₹29", img: "https://i.pinimg.com/736x/3c/6a/14/3c6a14bd4e0bf57c64c490b07bc80dd7.jpg" },
    { id: 7, name: "Matte Finish", price: "₹29", img: "https://i.pinimg.com/474x/94/9b/e9/949be92bdc0fce7693370d4c340df5ec.jpg" },
    { id: 8, name: "Waterproof DTF", price: "₹29", img: "https://i.pinimg.com/736x/1c/21/65/1c2165297dd41a0753410c1f79bfb094.jpg" },
  ];

  return (
    // Motion wrapper poore page ke liye
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Shuruat mein transparent aur 20px niche
      animate={{ opacity: 1, y: 0 }}   // Page load par visible aur original jagah
      transition={{ duration: 0.8, ease: "easeOut" }} // Smooth 0.8 second ease-out
    >
      <div
        style={{
          background: "#fff3eb",
          minHeight: "100vh",
          padding: "50px 0",
          margin: "20px",
          borderLeft: "5px solid #fe3d00",
          borderRadius: "10px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
        }}
      >
        <Container>
          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: "700", color: "#111" }}>
              DTF Sticker Collection
            </h2>

            <div
              style={{
                width: "60px",
                height: "4px",
                background: "#fe3d00",
                margin: "12px auto",
                borderRadius: "10px"
              }}
            />

            <p style={{ color: "#555" }}>
              High quality custom DTF stickers for laptop & bike branding.
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
                  <div style={{ overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={product.img}
                      style={{
                        height: "190px",
                        objectFit: "cover",
                        transition: "0.4s"
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.08)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>

                  <Card.Body className="text-center">
                    <Card.Title style={{ fontSize: "14px", fontWeight: "600" }}>
                      {product.name}
                    </Card.Title>

                    <Card.Text
                      style={{
                        fontWeight: "700",
                        color: "#fe3d00",
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
                    <Card.Text style={{ fontWeight: "700", color: "#fe3d00" }}>
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
                background: "#fe3d00",
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

      {/* Components outside the orange-border box but inside the motion div */}
      <MobileCaseHome />
      <LearningProductsHome />
    </motion.div>
  );
}