import React, { useState, useEffect } from "react";
import Nwmasonry from "../components/Nwmasonry";
import { trendingData as localTrendingData } from "../contexAndhooks/Ddata";

// 🔹 Helper function to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array]; // original array ko mutate na kare
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Trending() {
  const [fadeIn, setFadeIn] = useState(false);
  const [trendingItems, setTrendingItems] = useState(shuffleArray(localTrendingData));

  const API_URL = "https://serdeptry1st.onrender.com/api/products/trendingData";

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);

    const fetchTrendingFromDB = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
        const dbData = await response.json();

        if (dbData && Array.isArray(dbData) && dbData.length > 0) {
          const newUniqueItems = dbData.filter(
            (dbItem) => !localTrendingData.some((localItem) => localItem.id === dbItem.id)
          );
          const mergedData = shuffleArray([...localTrendingData, ...newUniqueItems]);
          setTrendingItems(mergedData);
        }
      } catch (error) {
        console.error("Trending DB Fetch Error:", error);
        // Agar DB fail ho gaya to local data already shuffle karke show ho raha hai
      }
    };

    fetchTrendingFromDB();
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
      <h2 className="text-center mt-3" style={{ color: "#334155", fontWeight: "800" }}>
        Trending Collection
      </h2>

      {/* 🔥 Nwmasonry ko shuffled trendingItems pass kiya */}
      <Nwmasonry images={trendingItems} categoryName="Trending" />
    </div>
  );
}