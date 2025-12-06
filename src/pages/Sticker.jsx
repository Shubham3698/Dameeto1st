import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import { stickerData } from "../contexAndhooks/Ddata";

export default function Sticker() {
  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh", }}>
      <h2 className="text-center mt-3">Sticker Collection</h2>

      <Nwmasonry 
        images={stickerData} 
        categoryName="sticker"
      />
    </div>
  );
}
