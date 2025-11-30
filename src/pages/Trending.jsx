import React from "react";
import Nwmasonry from "../components/Nwmasonry";

export default function Sticker() {
  const stickerImages = [
    "https://i.pinimg.com/1200x/5a/ad/0a/5aad0a8534ff652ffab1788930547741.jpg",
    "https://i.pinimg.com/736x/48/ba/91/48ba918c7fbdeee6056a7e664f35481b.jpg",
    "https://i.pinimg.com/1200x/8b/0c/14/8b0c14adee9fc943bc139a125a0fc400.jpg",
    "https://i.pinimg.com/1200x/80/2c/6d/802c6df0611780efb775913bc18ad73a.jpg",
    "https://i.pinimg.com/736x/c5/31/c3/c531c3a450cb52d496b132bea6dee5fb.jpg",
    "https://i.pinimg.com/736x/59/25/04/5925040a9c9e5814e66af9e93ffb31ff.jpg",
    "https://i.pinimg.com/736x/01/c2/ad/01c2ad7a7c93fc6508ed6753daf04455.jpg",
    "https://i.pinimg.com/736x/91/a2/1e/91a21e1ae32dd8f7d353f13bcac7cd07.jpg",
    "https://i.pinimg.com/1200x/da/d0/ae/dad0ae19bc31931008317564ba5ff832.jpg"
  ];

  return (
    <div>
      <Nwmasonry images={stickerImages} categoryName="Trending" />
    </div>
  );
}
