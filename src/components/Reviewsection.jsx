import React from "react";
import { Container } from "react-bootstrap";
import ReviewCard from "./Reviewcrd";

export default function ReviewSection() {
  const reviews = [
    {
      img: "https://i.pinimg.com/1200x/b2/ba/fb/b2bafb418b82abb211bde55889125d16.jpg",
      name: "Aarav Sharma",
      review: "Amazing quality! Stickers are thick and premium.",
      rating: 5,
    },
    {
      img: "https://i.pinimg.com/1200x/45/92/05/459205eebadf7b7d58be92bb1286a971.jpg",
      name: "Kiara Mehta",
      review: "Loved the designs ❤️ Perfect for laptop & bottles!",
      rating: 4,
    },

  ];

  return (
    <Container className="mt-5">
      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollbarWidth: "thin", // Firefox
        }}
      >
        {reviews.map((item, index) => (
          <div key={index} style={{ flex: "0 0 auto" }}>
            <ReviewCard
              img={item.img}
              name={item.name}
              review={item.review}
              rating={item.rating}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
