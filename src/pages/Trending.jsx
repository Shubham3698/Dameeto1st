import React, { useState, useEffect } from "react";
import Nwmasonry from "../components/Nwmasonry";
import { trendingData as localTrendingData } from "../contexAndhooks/Ddata";

export default function Trending() {
  const [fadeIn, setFadeIn] = useState(false);
  // 🔥 Step 1: Local data se state initialize karein
  const [trendingItems, setTrendingItems] = useState(localTrendingData);

  // 🔥 Render URL update kiya gaya hai
  const API_URL = "https://serdeptry1st.onrender.com/api/products/trendingData";

  useEffect(() => {
    // 🔹 Fade-in effect on mount
    const timer = setTimeout(() => setFadeIn(true), 50);

    // 🔥 Database se data fetch karne ka logic
    const fetchTrendingFromDB = async () => {
      try {
        const response = await fetch(API_URL);
        
        // Check karein ki response okay hai ya nahi
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const dbData = await response.json();

        if (dbData && Array.isArray(dbData) && dbData.length > 0) {
          // Check for duplicate IDs to prevent double rendering
          const newUniqueItems = dbData.filter(dbItem => 
            !localTrendingData.some(localItem => localItem.id === dbItem.id)
          );
          
          // 🔥 Merge local data + database data
          setTrendingItems([...localTrendingData, ...newUniqueItems]);
        }
      } catch (error) {
        console.error("Trending DB Fetch Error:", error);
        // Error hone par localTrendingData waise bhi state mein hai, 
        // toh user ko blank screen nahi dikhegi.
      }
    };

    fetchTrendingFromDB();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      background: "#fff3eb",
      minHeight: "100vh",
      opacity: fadeIn ? 1 : 0,
      transition: "opacity 0.8s ease-in"
    }}>
      <h2 className="text-center mt-3" style={{ color: "#334155", fontWeight: "800" }}>
        Trending Collection
      </h2>
      
      {/* 🔥 Ab state wala merged data 'trendingItems' pass ho raha hai */}
      <Nwmasonry 
        images={trendingItems} 
        categoryName="Trending" 
      />
    </div>
  );
}