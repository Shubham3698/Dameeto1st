import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import { trendingData } from "../contexAndhooks/Ddata";

export default function Trending() {
  return (
    <div style={{ background: "#fff3eb" }}>
      <Nwmasonry images={trendingData} categoryName="Trending" />
    </div>
  );
}
