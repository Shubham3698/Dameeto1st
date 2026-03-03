import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/PriceCard";

export default function LearningProductsPage() {

  // 🔥 Updated Products (ImageDetails Compatible)
  const products = [
     {
    id: "tr-1",
    category: "trending",
    title: "My Cute Board Book – Vegetables (Waterproof Edition)",
    shortDesc: "My Cute Board Book – Vegetables is specially designed for toddlers to learn vegetable names in a fun way ",
    longDesc: "My Cute Board Book – Vegetables is specially designed for toddlers to learn vegetable names in a fun way.It comes with hard board pages that are strong and long-lasting.The waterproof material makes it safe from spills and rough use.Its compact 12×12 cm size is perfect for little hands to hold easily.Bright pictures help improve vocabulary and early learning skills. 🌱📚",
    finalPrice: 79,
    originalPrice: 299,
    discount: 33,
    rating: 4.5,
    stock: 10,
    src: "https://i.pinimg.com/736x/7d/f5/ff/7df5ff2c4e6d86449f56effbe64c1c15.jpg",
    subImages: [
      "https://i.pinimg.com/736x/21/fc/74/21fc7494ca3b234f39ceda3a1448a3f8.jpg",
      "https://i.pinimg.com/474x/12/8e/c3/128ec3852edec5d67756262be8cfab79.jpg",
      "https://i.pinimg.com/736x/36/ce/52/36ce52e218df0b9e1cb555b0e5332e19.jpg"
    ],
    tags: ["Board book", ],
  },
    {
      id: 1,
      title: "Alphabet Board Book",
      shortDesc: "Perfect book for toddlers to learn ABC.",
      longDesc:
        "This colorful alphabet board book helps children recognize letters with bright images and durable pages specially designed for small hands.",
      finalPrice: 299,
      originalPrice: 399,
      src: "https://i.pinimg.com/736x/3d/0a/31/3d0a316a90cc199b0cf78d3b0d1b295f.jpg"
    },
    {
      id: 2,
      title: "Animal Picture Book",
      shortDesc: "Fun animal learning book.",
      longDesc:
        "Kids can explore the animal world through vibrant illustrations that improve memory and recognition skills.",
      finalPrice: 249,
      originalPrice: 349,
      src: "https://i.pinimg.com/736x/ee/81/4e/ee814ed3908c65832b96e51dae1910d6.jpg"
    },
    {
      id: 3,
      title: "Numbers & Shapes Book",
      shortDesc: "Learn numbers and shapes easily.",
      longDesc:
        "An interactive board book that teaches numbers and shapes in a playful and engaging way.",
      finalPrice: 269,
      originalPrice: 369,
      src: "https://i.pinimg.com/736x/ea/09/5e/ea095e535d3562621a87cc91736a3e96.jpg"
    },
    {
      id: 4,
      title: "First Words Book",
      shortDesc: "Build vocabulary for toddlers.",
      longDesc:
        "Helps children identify common everyday objects and develop early speaking skills.",
      finalPrice: 199,
      originalPrice: 299,
      src: "https://i.pinimg.com/1200x/3b/e6/20/3be620eee32e3c523012f1e645c16da1.jpg"
    },
    {
      id: 5,
      title: "Alphabet Play Mat",
      shortDesc: "Soft foam alphabet mat.",
      longDesc:
        "Large alphabet mat made of safe foam material, perfect for indoor play and early learning.",
      finalPrice: 799,
      originalPrice: 999,
      src: "https://i.pinimg.com/1200x/60/34/da/6034da8925097f5ec71c629ba90ddad8.jpg"
    },
    {
      id: 6,
      title: "Animal World Play Mat",
      shortDesc: "Fun jungle themed mat.",
      longDesc:
        "A colorful jungle play mat designed to stimulate imagination and improve coordination skills.",
      finalPrice: 899,
      originalPrice: 1099,
      src: "https://i.pinimg.com/1200x/09/59/80/0959809c43cc41db9b5f8ae7807dbcdc.jpg"
    },
    {
      id: 7,
      title: "Numbers Foam Mat",
      shortDesc: "Learn numbers while playing.",
      longDesc:
        "Interlocking foam number mat that helps kids learn counting in an interactive way.",
      finalPrice: 749,
      originalPrice: 949,
      src: "https://i.pinimg.com/1200x/62/32/8c/62328cd0c0fa5361b4dbf165f8d68977.jpg"
    },
    {
      id: 8,
      title: "Shapes Puzzle Mat",
      shortDesc: "Colorful shape puzzle mat.",
      longDesc:
        "Enhances motor skills and shape recognition through interactive floor play.",
      finalPrice: 849,
      originalPrice: 1049,
      src: "https://i.pinimg.com/736x/f9/f8/f0/f9f8f081b517e70084a92f5880e53feb.jpg"
    },
    {
      id: 9,
      title: "Touch & Feel Book",
      shortDesc: "Sensory learning experience.",
      longDesc:
        "Textured pages that allow toddlers to touch and explore different materials safely.",
      finalPrice: 349,
      originalPrice: 449,
      src: "https://i.pinimg.com/736x/f1/25/e9/f125e9f5a699ad6186cb90464e9a583d.jpg"
    },
    {
      id: 10,
      title: "Flashcard Learning Kit",
      shortDesc: "Complete early learning kit.",
      longDesc:
        "Includes alphabet, number, and animal flashcards to boost memory and cognitive skills.",
      finalPrice: 399,
      originalPrice: 499,
      src: "https://i.pinimg.com/736x/b7/a2/bd/b7a2bd58e7115c1bdb98eaecc0fdcb42.jpg"
    }
  ];

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "40px 0" }}>
      <Container>
        <h2 className="text-center mb-4">All Learning Products</h2>

        <Row>
          {products.map((item) => (
            <Col key={item.id} xs={6} md={4} lg={3} className="mb-4">
              <ProductCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}