import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!item?.id) return;

    const encodedId = btoa(item.id.toString());

    navigate(`/image/${encodedId}`, {
      state: {
        item,
        category: "learning-products"
      }
    });
  };

  // 🔥 Universal Field Handling
  const image = item.img || item.src;
  const title = item.name || item.title;
  const price = item.price || item.finalPrice;

  return (
    <Card
      onClick={handleClick}
      style={{
        cursor: "pointer",
        borderRadius: "15px",
        border: "none",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease"
      }}
      className="h-100"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Card.Img
        variant="top"
        src={image}
        style={{
          height: "170px",
          objectFit: "cover",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px"
        }}
      />

      <Card.Body className="text-center">
        <Card.Title style={{ fontSize: "14px", minHeight: "40px" }}>
          {title}
        </Card.Title>

        <Card.Text
          style={{
            fontWeight: "700",
            color: "#007bff",
            fontSize: "16px"
          }}
        >
          ₹{price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}