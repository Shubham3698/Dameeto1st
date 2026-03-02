import React, { useState, useEffect } from "react";
import Nwmasonry from "../components/Nwmasonry";
import { stickerData as localStickerData } from "../contexAndhooks/Ddata"; 

export default function Sticker() {
  const [fadeIn, setFadeIn] = useState(false);
  // Initial state with local data
  const [stickers, setStickers] = useState(localStickerData);

  // 🔥 Production URL update kiya gaya hai
  const API_URL = "https://serdeptry1st.onrender.com/api/products/stickerData";

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);

    const fetchNewStickers = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dbData = await response.json();

        if (dbData && Array.isArray(dbData) && dbData.length > 0) {
          // Unique items filter karein taaki duplicates na aayein
          const newItems = dbData.filter(dbItem => 
            !localStickerData.some(localItem => localItem.id === dbItem.id)
          );
          
          // Merge local and new DB data
          setStickers([...localStickerData, ...newItems]);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
        // Error ke waqt hum local data hi dikhate rahenge (No crash)
      }
    };

    fetchNewStickers();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      background: "#fff3eb",
      minHeight: "100vh",
      opacity: fadeIn ? 1 : 0,
      transition: "opacity 0.8s ease-in"
    }}>
      <h2 className="text-center mt-3">Sticker Collection</h2>
      
      <Nwmasonry 
        images={stickers} 
        categoryName="sticker"
      />
    </div>
  );
}