import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import {
  stickerData,
  trendingData,
  posterData,
  goodiesData,
  funnyData,
  hotData
} from "../contexAndhooks/Ddata";

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbResults, setDbResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 UPDATED: Ab ye seedha tumhare Render URL se connect karega
  const BASE_URL = "https://serdeptry1st.onrender.com/api/products"; 

  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchSearchFromDB = async () => {
      if (!query) return;
      setLoading(true);
      try {
        // Render API call
        const response = await axios.get(`${BASE_URL}/search?q=${query}`);
        
        console.log("Database results found from Render:", response.data.length);
        setDbResults(response.data || []);
      } catch (error) {
        // Agar Render server 'sleep' mode mein ho ya network issue ho
        console.error("Search DB Error on Render:", error);
        setDbResults([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchSearchFromDB();
  }, [query, BASE_URL]);

  const finalResults = useMemo(() => {
    // 1. 🔥 Local Data Filter (Functionality kept intact)
    const allLocalData = [
      ...stickerData, 
      ...trendingData, 
      ...posterData, 
      ...goodiesData, 
      ...funnyData, 
      ...hotData
    ];

    const filteredLocal = allLocalData.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(query);
      const tagMatch = item.tag?.toLowerCase().includes(query) || 
                       item.tags?.some(t => t.toLowerCase().includes(query));
      return titleMatch || tagMatch;
    });

    // 2. 🔥 Merge & Deduplicate (Local + Render DB results)
    const merged = [...filteredLocal, ...dbResults];
    
    // Map ensures unique items by 'id' to avoid key warnings
    const uniqueResults = Array.from(
      new Map(merged.map(item => [item.id, item])).values()
    );
    
    return uniqueResults;
  }, [query, dbResults]);

  const openImage = (item) => {
    // 🔥 Encoding ID (Exact logic for your ImageDetails)
    const encodedId = btoa(item.id);
    navigate(`/image/${encodedId}`, { state: { item } });
  };

  return (
    <div style={{ background: "#fff3eb", minHeight: "100vh" }} className="container py-4">
      <h4 className="text-center mb-4" style={{fontWeight: '800', color: '#334155'}}>
        Dameeto Search: <span style={{color: '#fe3d00'}}>"{query}"</span>
      </h4>

      {loading && (
        <div className="text-center my-4" style={{color: '#fe3d00', fontWeight: 'bold'}}>
          🔍 Searching the Render vault...
        </div>
      )}

      {finalResults.length === 0 && !loading ? (
        <div className="text-center mt-5">
           <h3 style={{color: '#334155'}}>Ouch! Kuch nahi mila.</h3>
           <p className="text-muted">Try searching for 'Anime', 'Sticker', or 'Poster'</p>
        </div>
      ) : (
        <div className="masonry-layout">
           <style>{`
            .masonry-layout { 
              column-count: 2; 
              column-gap: 15px; 
              padding: 10px; 
            }
            @media (min-width: 768px) { .masonry-layout { column-count: 3; } }
            @media (min-width: 1024px) { .masonry-layout { column-count: 4; } }
            
            .search-card { 
              width: 100%; 
              margin-bottom: 15px; 
              border-radius: 12px; 
              cursor: pointer; 
              transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
              box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
              display: block;
            }
            .search-card:hover { 
              transform: scale(1.03); 
              box-shadow: 0 12px 24px rgba(0,0,0,0.15); 
            }
           `}</style>
           
           {finalResults.map((item) => (
             <img
               key={item.id}
               src={item.src}
               className="search-card"
               alt={item.title}
               onClick={() => openImage(item)}
             />
           ))}
        </div>
      )}
    </div>
  );
}