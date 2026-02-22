import React, { useState, useEffect } from "react";
import Nwmasonry from "../components/Nwmasonry";
import { posterData } from "../contexAndhooks/Ddata";

export default function Poster() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50); // small delay for smooth effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      background: "#fff3eb",
      minHeight: "100vh",
      opacity: fadeIn ? 1 : 0,
      transition: "opacity 0.8s ease-in"
    }}>
      <Nwmasonry images={posterData} categoryName="Poster" />
    </div>
  );
}