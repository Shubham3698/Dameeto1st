import React from "react";
import { Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

export default function ReviewCard({ img, name, review, rating = 5 }) {
  return (
    <Card
      style={{
        width: "260px",
        border: "none",
        textAlign: "center",
        background: "transparent", // Card ka background bhi transparent
      }}
    >
      {/* Product Image */}
      <Card.Img
        variant="top"
        src={img}
        style={{
          width: "100%",
          height: "230px",
          objectFit: "contain", // poori image dikhe
          borderRadius: "10px",
          background: "transparent", // Background hata diya
        }}
      />

      <Card.Body style={{ padding: "15px 10px" }}>
        {/* Stars */}
        <div>
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} color="#fe3d00" style={{ margin: "0 3px" }} />
          ))}
        </div>

        {/* Name */}
        <Card.Title style={{ marginTop: "10px", fontSize: "18px" }}>
          {name}
        </Card.Title>

        {/* Review Text */}
        <Card.Text
          style={{
            fontSize: "14px",
            marginTop: "5px",
            color: "#444",
          }}
        >
          "{review}"
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
