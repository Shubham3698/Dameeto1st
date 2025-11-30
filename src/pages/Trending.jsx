import React from "react";
import Nwmasonry from "../components/Nwmasonry";

export default function Trending() {
  const trendingImages = [
    {
      src: "https://i.pinimg.com/originals/11/39/64/1139647b65167a1c2a9f5895b58083b2.gif",
      title: "Animated Aesthetic GIF",
      shortDesc: "Smooth loop animation.",
      longDesc:
        "A unique animated sticker-style GIF that expresses aesthetic vibes and emotions."
    },
    {
      src: "https://i.pinimg.com/1200x/5a/ad/0a/5aad0a8534ff652ffab1788930547741.jpg",
      title: "Aesthetic Girl Art",
      shortDesc: "Premium digital artwork.",
      longDesc:
        "Trending aesthetic girl illustration perfect for covers, wallpapers, and designs."
    },
    {
      src: "https://i.pinimg.com/736x/48/ba/91/48ba918c7fbdeee6056a7e664f35481b.jpg",
      title: "Dark Mood Anime Art",
      shortDesc: "Stylish anime design.",
      longDesc:
        "Represents deep emotions and mood expression. Very trending among youth."
    },
    {
      src: "https://i.pinimg.com/1200x/8b/0c/14/8b0c14adee9fc943bc139a125a0fc400.jpg",
      title: "Moody Girl Illustration",
      shortDesc: "Minimal clean art.",
      longDesc:
        "Soft shades and emotional aesthetic artwork, suitable for any theme."
    },
    {
      src: "https://i.pinimg.com/1200x/80/2c/6d/802c6df0611780efb775913bc18ad73a.jpg",
      title: "Cool Girl Modern Look",
      shortDesc: "Trendy fashion artwork.",
      longDesc:
        "Represents confidence, style, and modern youth culture."
    },
    {
      src: "https://i.pinimg.com/736x/c5/31/c3/c531c3a450cb52d496b132bea6dee5fb.jpg",
      title: "Cute Cat Artwork",
      shortDesc: "Adorable cute-style art.",
      longDesc:
        "Perfect for diaries, laptops, and minimal art lovers."
    },
    {
      src: "https://i.pinimg.com/736x/59/25/04/5925040a9c9e5814e66af9e93ffb31ff.jpg",
      title: "Sad Anime Boy",
      shortDesc: "Emotional character.",
      longDesc:
        "Expresses relatable emotions through clean anime visual style."
    },
    {
      src: "https://i.pinimg.com/736x/01/c2/ad/01c2ad7a7c93fc6508ed6753daf04455.jpg",
      title: "Vibes Graphic Art",
      shortDesc: "Aesthetic minimalist design.",
      longDesc:
        "Represents personal vibes and modern aesthetic energy."
    },
    {
      src: "https://i.pinimg.com/736x/91/a2/1e/91a21e1ae32dd8f7d353f13bcac7cd07.jpg",
      title: "Cool Character Art",
      shortDesc: "Stylish detailed character.",
      longDesc:
        "Trending among teens for its bold aesthetic and expression."
    },
    {
      src: "https://i.pinimg.com/1200x/da/d0/ae/dad0ae19bc31931008317564ba5ff832.jpg",
      title: "Soft Pastel Girl",
      shortDesc: "Calm pastel artwork.",
      longDesc:
        "Represents soft emotions, peaceful vibes, and clean color palette."
    }
  ];

  return (
    <div style={{ background: "#fff3eb" }}>
      <Nwmasonry images={trendingImages} categoryName="Trending" />
    </div>
  );
}
