import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { stickerData, trendingData, posterData, goodiesData,funnyData } from "../contexAndhooks/Ddata";

export default function SearchResults() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search).get("query")?.toLowerCase();

  // Merge all data arrays into a single array
  const allData = [...stickerData, ...trendingData, ...posterData, ...goodiesData,...funnyData];

  // Filter based on query matching title or tag
  const results = allData.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      (item.tag && item.tag.toLowerCase().includes(query))
  );

  const openImage = (item) => {
    navigate("/image-details", { state: { item } });
  };

  return (
    <div style={{ background: "#fff3eb" }} className="container py-4">
      <h4 style={{ color: "#333", textAlign: "center", marginBottom: "15px" }}>
        Results for: <strong>{query}</strong>
      </h4>

      {results.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>❌ No results found</p>
      ) : (
        <>
          <style>{`
            .masonry {
              column-count: 1;
              column-gap: 12px;
            }
            @media (max-width: 600px) {
              .masonry { column-count: 2 !important; }
            }
            @media (min-width: 768px) {
              .masonry { column-count: 3; }
            }
            @media (min-width: 992px) {
              .masonry { column-count: 4; }
            }
            .masonry img {
              width: 100%;
              margin-bottom: 12px;
              border-radius: 14px;
              break-inside: avoid;
              transition: 0.3s ease;
              cursor: pointer;
              box-shadow: 0 4px 10px rgba(0,0,0,0.12);
            }
            .masonry img:hover {
              transform: scale(1.05);
              box-shadow: 0 10px 20px rgba(0,0,0,0.22);
            }
          `}</style>

          <div className="masonry">
            {results.map((item, i) => (
              <img
                key={i}
                src={item.src}
                alt={item.title}
                onClick={() => openImage(item)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
