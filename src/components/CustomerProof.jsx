import React from "react";
import { FaStar, FaUser } from "react-icons/fa";

export default function CustomerProof({
  customers = "5000+",
  rating = "4.9",
  images = [],
}) {
  const totalSlots = 3;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "8px",
      }}
    >
      {/* LEFT: Avatars */}
      <div style={{ display: "flex" }}>
        {[...Array(totalSlots)].map((_, i) => {
          const img = images[i];

          return img ? (
            <img
              key={i}
              src={img}
              alt="user"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "2px solid white",
                marginLeft: i === 0 ? "0" : "-8px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              key={i}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "2px solid white",
                marginLeft: i === 0 ? "0" : "-8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#eee",
                color: "#888",
                fontSize: "14px",
              }}
            >
              <FaUser />
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            color: "#f5c518",
            fontSize: "13px",
          }}
        >
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} />
          ))}
          <span style={{ color: "#333", marginLeft: "5px", fontSize: "12px" }}>
            {rating}
          </span>
        </div>

        <span style={{ fontSize: "12px", color: "#555" }}>
          <strong>{customers}</strong> people ordered
        </span>
      </div>
    </div>
  );
}