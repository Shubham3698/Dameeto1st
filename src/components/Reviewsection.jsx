import React from "react";
import { Container } from "react-bootstrap";
import ReviewCard from "./Reviewcrd";

export default function ReviewSection() {
  const reviews = [
    {
      img: "https://i.pinimg.com/736x/4c/2d/33/4c2d33d3a085e7ea94e2e325481b471e.jpg",
      name: "Shubham pandey",
      review: "Amazing quality! Stickers are thick and premium.",
      rating: 5,
    },
    {
      img: "https://i.pinimg.com/736x/d3/60/ae/d360ae6dd684828f81b4290cbe430c2e.jpg",
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
