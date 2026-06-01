import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import heroImg from "../assets/dmtl.jpg"; 
import FAQ from "../components/Faq";
import Slides from "../components/Slideabout";
import { useNavigate } from "react-router-dom";
import Reviews from "../components/Reviewsection";
import { FaShippingFast, FaUndo, FaStar, FaHeart, FaInstagram, FaYoutube } from "react-icons/fa"; // Updated to Insta & YouTube

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#fff3eb", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 🔹 CSS for Smooth Animations & Hover Effects */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          .policy-card {
            transition: all 0.3s ease-in-out;
            border: none;
            border-radius: 15px;
            background: #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .policy-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(254, 61, 0, 0.15);
          }
          .cta-btn {
            transition: all 0.3s ease;
          }
          .cta-btn:hover {
            background-color: #fe3d00 !important;
            color: #fff !important;
            transform: scale(1.05);
          }
          /* Footer Icon Animation */
          .footer-icon {
            color: #aaa;
            font-size: 1.8rem; /* Thoda bada kar diya for better visibility */
            transition: all 0.3s ease;
            text-decoration: none;
          }
          .footer-icon:hover {
            color: #fe3d00;
            transform: translateY(-5px);
          }
        `}
      </style>

      {/* 1. 🖼️ Hero Image Section */}
      <div className="animate-up" style={{ width: "100%", position: "relative" }}>
        <img 
          src={heroImg} 
          alt="About Us" 
          style={{ 
            width: "100%", 
            height: "auto",
            maxHeight: "60vh",
            objectFit: "cover",
            borderBottomLeftRadius: "30px",
            borderBottomRightRadius: "30px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }} 
        />
      </div>

      <Container className="py-5">
        
        {/* 2. 📖 Our Story / Brand Identity */}
        <Row className="justify-content-center text-center mb-5 animate-up" style={{ animationDelay: "0.2s" }}>
          <Col md={8}>
            <h2 style={{ fontWeight: "800", color: "#333", fontSize: "2.5rem" }}>
              Welcome to <span style={{ color: "#fe3d00" }}>Our World</span> <FaHeart style={{ color: "#fe3d00", fontSize: "2rem" }}/>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#555", marginTop: "15px", lineHeight: "1.8" }}>
              We bring your favorite characters and fandoms to life! From epic Marvel goodies to exclusive Anime merch and quirky stickers, we are dedicated to providing the best quality products for true fans. Our mission is to deliver smiles, one package at a time.
            </p>
          </Col>
        </Row>

        {/* 3. 🛡️ Store Policies / Why Choose Us */}
        <Row className="mb-5 animate-up" style={{ animationDelay: "0.4s" }}>
          <Col md={4} className="mb-4">
            <Card className="policy-card text-center p-4 h-100">
              <div style={{ fontSize: "3rem", color: "#fe3d00", marginBottom: "15px" }}>
                <FaStar />
              </div>
              <Card.Body>
                <Card.Title style={{ fontWeight: "700" }}>Premium Quality</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  Every item is handpicked and checked to ensure you get only the top-tier merchandise.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="policy-card text-center p-4 h-100">
              <div style={{ fontSize: "3rem", color: "#fe3d00", marginBottom: "15px" }}>
                <FaShippingFast />
              </div>
              <Card.Body>
                <Card.Title style={{ fontWeight: "700" }}>Fast Delivery</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  We process orders lightning fast so your favorite goodies reach your doorstep in no time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="policy-card text-center p-4 h-100">
              <div style={{ fontSize: "3rem", color: "#fe3d00", marginBottom: "15px" }}>
                <FaUndo />
              </div>
              <Card.Body>
                <Card.Title style={{ fontWeight: "700" }}>Easy Returns</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  Not satisfied? No worries! We offer a hassle-free return policy to keep your experience smooth.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 4. 📸 Carousel / Slides Component */}
        <div className="mb-5 animate-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-center mb-4" style={{ fontWeight: "700", color: "#333" }}>Sneak Peek</h3>
          <Slides />
        </div>

        {/* 5. ⭐ Customer Reviews Component */}
        <div className="mb-5 animate-up" style={{ animationDelay: "0.6s" }}>
          <Reviews />
        </div>

        {/* 6. ❓ FAQ & Call to Action */}
        <div className="text-center mt-5 mb-5 animate-up" style={{ animationDelay: "0.7s" }}>
          <link
            href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
            rel="stylesheet"
          />
          
          <FAQ />
          
          <div className="mt-5">
            <Button
              className="cta-btn px-5 py-2"
              onClick={() => navigate("/home")}
              style={{
                background: "white",
                color: "#fe3d00",
                border: "3px solid #fe3d00",
                borderRadius: "50px", // Rounded pill shape for modern look
                fontFamily: "'Great Vibes', cursive",
                fontSize: "26px",
                boxShadow: "0 5px 15px rgba(254, 61, 0, 0.2)",
              }}
              size="lg"
            >
              Explore Our Products
            </Button>
          </div>
        </div>
      </Container>
      
      {/* 7. 🖤 Classic & Impressive Footer (Insta & YT Only) */}
      <footer 
        className="animate-up" 
        style={{ 
          backgroundColor: "#111", 
          padding: "40px 0 20px 0", 
          marginTop: "40px", 
          borderTopLeftRadius: "40px", 
          borderTopRightRadius: "40px",
          animationDelay: "0.8s" 
        }}
      >
        <Container>
          <Row className="align-items-center">
            {/* Brand Logo / Text */}
            <Col md={4} className="text-center text-md-start mb-4 mb-md-0">
              <h3 style={{ color: "#fff", fontWeight: "800", margin: 0, letterSpacing: "1px" }}>
                Dameeto<span style={{ color: "#fe3d00" }}>.</span>
              </h3>
              <p style={{ color: "#888", fontSize: "0.95rem", margin: "5px 0 0 0" }}>
                Delivering smiles, one package at a time.
              </p>
            </Col>

            {/* Social Icons - Sirf Insta aur YT */}
            <Col md={4} className="text-center mb-4 mb-md-0 d-flex justify-content-center gap-4">
              <a href="https://www.instagram.com/dameeto?igsh=MTQxMDAwc2h0YzllaA==" target="_blank" rel="noreferrer" className="footer-icon" title="Instagram">
                <FaInstagram />
              </a>
              <a href="www.youtube.com/@dameeto" target="_blank" rel="noreferrer" className="footer-icon" title="YouTube">
                <FaYoutube />
              </a>
            </Col>

            {/* Copyright */}
            <Col md={4} className="text-center text-md-end">
              <p style={{ color: "#888", fontSize: "0.9rem", margin: 0 }}>
                &copy; {new Date().getFullYear()} Dameeto. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

    </div>
  );
}