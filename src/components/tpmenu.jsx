// HorizontalTopMenu.jsx
import React, { useState } from "react";

export default function HorizontalTopMenu({ items }) {
  const data = items || [
    "Home",
    "About us",
    "Sticker",
    "Poster",
    "Heroic",
    "Marval",
    "Goodies",
    "Gadgets",
    "Photography",
    "Aeshthetic",
    "Art",
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",       // thoda bada for touch-friendly
        backgroundColor: "#fff", // background color
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        scrollBehavior: "smooth",
        outline: "none",
        zIndex: 9999,         // page ke upar rahe
       
      }}
      className="horizontal-menu"
      tabIndex={-1}
    >
      <style>{`
        /* Hide scrollbar completely */
        .horizontal-menu::-webkit-scrollbar {
          display: none;
        }
        .horizontal-menu {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }

        .menu-item {
          display: inline-block;
          margin-right: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          padding-bottom: 4px;
        }

        .menu-item.active {
          border-bottom: 2px solid red; /* Red underline on active */
        }
      `}</style>

      {data.map((label, i) => (
        <div
          key={i}
          className={`menu-item ${activeIndex === i ? "active" : ""}`}
          onClick={() => setActiveIndex(i)}
          tabIndex={-1}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
