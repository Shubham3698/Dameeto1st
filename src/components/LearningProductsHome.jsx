import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LearningProductsHome() {

  const navigate = useNavigate();

  const boardBooks = [
    { id: 1, name: "Alphabet Board Book", price: "₹299", img: "https://i.pinimg.com/736x/3d/0a/31/3d0a316a90cc199b0cf78d3b0d1b295f.jpg" },
    { id: 2, name: "Animal Picture Book", price: "₹249", img: "https://i.pinimg.com/736x/ee/81/4e/ee814ed3908c65832b96e51dae1910d6.jpg" },
    { id: 3, name: "Numbers & Shapes Book", price: "₹269", img: "https://i.pinimg.com/736x/ea/09/5e/ea095e535d3562621a87cc91736a3e96.jpg" },
    { id: 4, name: "First Words Book", price: "₹199", img: "https://i.pinimg.com/1200x/3b/e6/20/3be620eee32e3c523012f1e645c16da1.jpg" },
  ];

  const playMats = [
    { id: 5, name: "Alphabet Play Mat", price: "₹799", img: "https://i.pinimg.com/1200x/60/34/da/6034da8925097f5ec71c629ba90ddad8.jpg" },
    { id: 6, name: "Animal World Play Mat", price: "₹899", img: "https://i.pinimg.com/1200x/09/59/80/0959809c43cc41db9b5f8ae7807dbcdc.jpg" },
    { id: 7, name: "Numbers Foam Mat", price: "₹749", img: "https://i.pinimg.com/1200x/62/32/8c/62328cd0c0fa5361b4dbf165f8d68977.jpg" },
    { id: 8, name: "Shapes Puzzle Mat", price: "₹849", img: "https://i.pinimg.com/736x/f9/f8/f0/f9f8f081b517e70084a92f5880e53feb.jpg" },
  ];

  const topSelling = [
    { id: 9, name: "Touch & Feel Book", price: "₹349", img: "https://i.pinimg.com/736x/f1/25/e9/f125e9f5a699ad6186cb90464e9a583d.jpg" },
    { id: 10, name: "Sticker Activity Book", price: "₹299", img: "https://i.pinimg.com/1200x/53/dc/5a/53dc5a06a2f3cc427da26f5d6b1d42fc.jpg" },
    { id: 11, name: "Foam Puzzle Mat Set", price: "₹999", img: "https://i.pinimg.com/1200x/d0/c1/62/d0c162ac384aec0dbb58a1f46435af13.jpg" },
    { id: 12, name: "Flashcard Learning Kit", price: "₹399", img: "https://i.pinimg.com/736x/b7/a2/bd/b7a2bd58e7115c1bdb98eaecc0fdcb42.jpg" },
  ];

  return (
    <div
      style={{
        background: "#e8f7ff",
        minHeight: "100vh",
        padding: "50px 0",
        margin: "20px",
        borderLeft: "6px solid #007bff",
        borderRadius: "10px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
      }}
    >
      <Container>

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: "700" }}>
            📚 Learning & Play Products
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
            Educational board books & play mats for toddlers.
          </p>
        </div>

        {/* BOARD BOOKS */}
        <h4 style={{ color: "#007bff", fontWeight: "600" }}>
          📖 Board Books
        </h4>

        <Row className="mb-4">
          {boardBooks.map((item) => (
            <Col key={item.id} xs={6} md={6} lg={3} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={item.img}
                  style={{ height: "170px", objectFit: "cover" }}
                />
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "14px" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "700", color: "#007bff" }}>
                    {item.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* PLAY MATS */}
        <h4 style={{ color: "#007bff", fontWeight: "600" }}>
          🧩 Play Mats
        </h4>

        <Row className="mb-5">
          {playMats.map((item) => (
            <Col key={item.id} xs={6} md={6} lg={3} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={item.img}
                  style={{ height: "170px", objectFit: "cover" }}
                />
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "14px" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "700", color: "#007bff" }}>
                    {item.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* TOP SELLING HORIZONTAL SCROLL */}
        <h4 style={{ fontWeight: "700" }}>🔥 Top Selling</h4>

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
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
              }}
            >
              <Card.Img
                variant="top"
                src={item.img}
                style={{ height: "160px", objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title style={{ fontSize: "13px" }}>
                  {item.name}
                </Card.Title>
                <Card.Text style={{ fontWeight: "700", color: "#007bff" }}>
                  {item.price}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* VIEW MORE BUTTON */}
        <div className="text-center mt-4">
          <Button
            onClick={() => navigate("/learning-products")}
            style={{
              background: "#007bff",
              border: "none",
              color: "white",
              borderRadius: "50px",
              padding: "10px 40px",
              fontWeight: "600",
              transition: "0.3s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#0056b3";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#007bff";
            }}
          >
            View All →
          </Button>
        </div>

      </Container>
    </div>
  );
}