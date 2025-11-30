import React from "react";
import Nwmasonry from "../components/Nwmasonry";

export default function Sticker() {
  const stickerImages = [
    {
      src: "https://i.pinimg.com/1200x/5a/ad/0a/5aad0a8534ff652ffab1788930547741.jpg",
      title: "Girl Aesthetic Sticker",
      shortDesc: "Premium glossy sticker.",
      longDesc:
        "This aesthetic girl sticker expresses mood, personality, vibes and looks great on phone covers and laptops."
    },
    {
      src: "https://i.pinimg.com/736x/48/ba/91/48ba918c7fbdeee6056a7e664f35481b.jpg",
      title: "Dark Anime Sticker",
      shortDesc: "High-quality matte finish.",
      longDesc:
        "Perfect for notebooks, laptops and diaries. Stylish expressive design representing emotions and individuality."
    },
    {
      src: "https://i.pinimg.com/1200x/8b/0c/14/8b0c14adee9fc943bc139a125a0fc400.jpg",
      title: "Moody Girl Art Sticker",
      shortDesc: "Top trending artistic design.",
      longDesc:
        "Crafted with aesthetic details, ideal for personal expression and daily vibe representation."
    },
    {
      src: "https://i.pinimg.com/1200x/80/2c/6d/802c6df0611780efb775913bc18ad73a.jpg",
      title: "Modern Cool Girl Sticker",
      shortDesc: "Premium waterproof sticker.",
      longDesc:
        "Designed for expressing modern personality and fashion sense on your accessories."
    },
    {
      src: "https://i.pinimg.com/736x/c5/31/c3/c531c3a450cb52d496b132bea6dee5fb.jpg",
      title: "Cute Cat Sticker",
      shortDesc: "Adorable pet-themed sticker.",
      longDesc:
        "Made for fun and cuteness lovers, perfect for diaries, bottles, laptops, and more."
    },
    {
      src: "https://i.pinimg.com/736x/59/25/04/5925040a9c9e5814e66af9e93ffb31ff.jpg",
      title: "Sad Anime Boy Sticker",
      shortDesc: "Emotional character design.",
      longDesc:
        "Shows deep emotions and relatable feelings. Best for mood expression and aesthetics."
    },
    {
      src: "https://i.pinimg.com/736x/01/c2/ad/01c2ad7a7c93fc6508ed6753daf04455.jpg",
      title: "Vibes Sticker Art",
      shortDesc: "Minimalist expressive sticker.",
      longDesc:
        "Represents personal vibes, aesthetic energy, and clean graphic style."
    },
    {
      src: "https://i.pinimg.com/736x/91/a2/1e/91a21e1ae32dd8f7d353f13bcac7cd07.jpg",
      title: "Cool Character Sticker",
      shortDesc: "Trendy new-gen design.",
      longDesc:
        "Designed for modern youth to reflect individuality, emotions, and personality."
    },
    {
      src: "https://i.pinimg.com/1200x/da/d0/ae/dad0ae19bc31931008317564ba5ff832.jpg",
      title: "Soft Aesthetic Girl Sticker",
      shortDesc: "Soft pastel tone sticker.",
      longDesc:
        "Represents soft emotions, calm vibes and smooth aesthetic art style."
    }
  ];

  return (
    <div style={{ background: "#fff3eb" }}>
      <Nwmasonry images={stickerImages} categoryName="sticker" />
    </div>
  );
}
