import React from "react";
import Nwmasonry from "../components/Nwmasonry";

export default function Sticker() {
  const stickerImages = [
    "https://i.pinimg.com/1200x/45/92/05/459205eebadf7b7d58be92bb1286a971.jpg",
    "https://i.pinimg.com/736x/60/2c/d7/602cd7ebc5cd8c71aef67b4338fb1997.jpg",
    "https://i.pinimg.com/1200x/13/43/a4/1343a43b4cc2701abdebead55c908a63.jpg",
    "https://i.pinimg.com/736x/52/36/6e/52366e37d38373ea59177a52a356c4f6.jpg",
    "https://i.pinimg.com/1200x/62/d7/ff/62d7ffd8a9e5f0991af281abe8c94f7d.jpg",
    "https://i.pinimg.com/736x/38/cc/af/38ccaf73cc226ac98d1f7c653af2ca86.jpg",
    "https://i.pinimg.com/1200x/81/5c/62/815c62fa8e4fe8404a7ae60c3e3d1a02.jpg",
    "https://i.pinimg.com/736x/5d/58/23/5d582381b3707b973548167a5aa99d80.jpg",
    "https://i.pinimg.com/736x/cf/a3/ae/cfa3ae0c9a718fea7295e7f07887c38e.jpg",
  ];

  return (
    <div>
      <Nwmasonry images={stickerImages} />
    </div>
  );
}
