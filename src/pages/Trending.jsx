import React, { useState, useEffect } from "react";
import Nwmasonry from "../components/Nwmasonry";
import { trendingData as localTrendingData } from "../contexAndhooks/Ddata";

export default function Trending() {
  const [fadeIn, setFadeIn] = useState(false);
  const [trendingItems, setTrendingItems] = useState(localTrendingData);

  const API_URL = "https://serdeptry1st.onrender.com/api/products/trendingData";

  useEffect(() => {
    // 🔹 Fade-in effect
    const timer = setTimeout(() => setFadeIn(true), 50);

    // 🔹 Fetch DB data
    const fetchTrending = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const dbData = await res.json();

        if (dbData && Array.isArray(dbData) && dbData.length > 0) {
          const newItems = dbData.filter(
            dbItem => !localTrendingData.some(local => local.id === dbItem.id)
          );
          setTrendingItems([...localTrendingData, ...newItems]);
        }
      } catch (err) {
        console.error("DB Fetch Error:", err);
      }
    };

    fetchTrending();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: "#fff3eb",
        minHeight: "100vh",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.8s ease-in",
      }}
    >
      <h2
        className="text-center mt-3"
        style={{ color: "#334155", fontWeight: 800 }}
      >
        Trending Collection
      </h2>
      <Nwmasonry images={trendingItems} categoryName="Trending" />
    </div>
  );
}