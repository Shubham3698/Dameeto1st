import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import heroImg from "../assets/dmtl.jpg"; // <-- image added here
import FAQ from "../components/Faq";
import Slides from "../components/Slideabout"
import Reviews from "../components/Reviewsection";

export default function About() {
  return (
    <div style={{ backgroundColor: "#fff3eb" }}>

      {/* Local Image (replacing img??) */}
      <div style={{ width: "100%", marginBottom: "20px" }}>
        <img 
          src={heroImg} 
          alt="About Dameeto" 
          style={{ width: "100%", borderRadius: "12px" }} 
        />
      </div>

      <Slides/>

      <Reviews/>


     
        <div className="text-center mt-4">
          <link
            href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
            rel="stylesheet"
          />
          <FAQ/>
          <Button
            style={{
              background: "white",
              color: "black",
              border: "4px solid #fe3d00",
              borderRadius: "6px",
              fontFamily: "'Great Vibes', cursive",
              fontSize: "22px",
            }}
            variant="danger"
            size="lg"
            className="px-4"
          >
            Explore Our Products
          </Button>
        </div>

        <div style={{ marginTop: "50px" }}></div>
    </div>
  );
}
