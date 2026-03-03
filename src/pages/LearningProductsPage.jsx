import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/PriceCard";
import { learningProducts } from "../contexAndhooks/Ddata";

export default function LearningProductsPage() {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "40px 0" }}>
      <Container>
        <h2 className="text-center mb-4">All Learning Products</h2>

        <Row>
          {learningProducts.map((item) => (
            <Col key={item.id} xs={6} md={4} lg={3} className="mb-4">
              <ProductCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}