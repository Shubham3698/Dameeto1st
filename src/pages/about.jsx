import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function About() {
  return (
    <div style={{ }}>
      {/* HERO SECTION */}
      <div
        style={{
          width: "100%",
          height: "320px",
          backgroundImage:
            "url('https://wimzi.ph/cdn/shop/files/Cute-Vinyl-Sticker-Pack.jpg?v=1736863505')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "40px",
            fontWeight: "900",
          }}
        >
          About Dameeto
        </div>
      </div>

      {/* DESCRIPTION CARDS */}
      <Container className="mt-5">
        <Row className="gy-4">
          <Col md={6}>
            <Card className="shadow-lg border-0">
              <Card.Body>
                <Card.Title className="fw-bold">Who We Are</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  <b>Dameeto</b> is the only brand that focuses on reflection and helps you to express your foremost vibes and the deep individuality within you through thoughtful crafting and curated goodies.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-lg border-0">
              <Card.Body>
                <Card.Title className="fw-bold">Our Vision</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  Our mission is to bring your desk, room, gadgets, and every
                  corner of your lifestyle to life with artistic,<b>bold</b>, and
                  meaningful designs. Dameeto aims to become <b>India’s most
                  loved aesthetic accessories brand.</b> 
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-lg border-0">
              <Card.Body>
                <Card.Title className="fw-bold">Quality Promise</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  Every product we create goes through premium UV-DTF printing,
                  high-grade material selection, and careful packaging so that
                  your experience is smooth and unforgettable.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-lg border-0">
              <Card.Body>
                <Card.Title className="fw-bold">What Makes Dameeto Special?</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  We believe designs speak louder than words. Our community-driven
                  concept ensures every piece reflects emotion, personality, and
                  boldness — just like you.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button style={{background:"white", color:"black", border:"3px solid #fe3b01"}} variant="danger" size="lg" className="px-4">
            Explore Our Products
          </Button>
        </div>
              <div style={{ marginTop: "50px" }}></div>

      </Container>
    </div>
  );
}
