import React from "react";
import Card from "react-bootstrap/Card";

function MasonryGallery({ items }) {
  const galleryStyle = {
    columnCount: 2,
    columnGap: "16px",
    display: "masonry",
    gap: "16px",
    width: "100%",
    padding: "10px",
  };

  const cardStyle = {
    breakInside: "avoid",
    marginBottom: "16px",
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
  };

  return (
    <div style={galleryStyle}>
      {items.map((item, index) => (
        <Card
          style={{ ...cardStyle, height: 200 + index * 30 }} // height vary karai
          key={index}
        >
          <Card.Img variant="top" src={item.img} />
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>{item.desc}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default MasonryGallery;
