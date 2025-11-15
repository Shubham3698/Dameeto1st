import React from "react";
import Card from "react-bootstrap/Card";

function CardItem({ img, title, desc }) {
  const cardStyle = {
    breakInside: "avoid",
    marginBottom: "16px",
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
  };

  return (
    <Card style={cardStyle}>
      <Card.Img variant="top" src={img} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardItem;
