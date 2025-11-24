// HorizontalTopMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HorizontalTopMenu({ items }) {
  const data = items || [
    { label: "Trending", path: "/" },
    { label: "About us", path: "/about" },
    { label: "Sticker", path: "/sticker" },
    { label: "Poster", path: "/poster" },
    { label: "Heroic", path: "/heroic" },
    { label: "Marval", path: "/marvel" },
    { label: "Goodies", path: "/goodies" },
    { label: "Gadgets", path: "/gadgets" },
    { label: "Photography", path: "/photo" },
    { label: "Aeshthetic", path: "/aesthetic" },
    { label: "Art", path: "/art" },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",          // UPDATED HEIGHT
        backgroundColor: "#FBF8F6",
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        zIndex: 9999,
      }}
      className="horizontal-menu"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .horizontal-menu::-webkit-scrollbar {
          display: none;
        }

        .menu-item {
          position: relative;
          font-family: 'Baloo 2', cursive !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;       /* Slightly more padding for bigger text */
          margin-right: 14px;
          font-size: 18px;       /* Bigger text */
          height: 36px;          /* Align inside 50px navbar */
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          color: #fe3d00;
        }

        /* Underline (centered, short) */
        .menu-item::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          height: 3px;
          width: 0%;              
          background: black;
          border-radius: 10px;
          transition: width 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }

        /* Hover animation */
        .menu-item:hover::after {
          width: 60%;
          opacity: 0.6;
        }

        /* Active animation */
        .menu-item.active::after {
          width: 60%;
          opacity: 1;
        }
      `}</style>

      {data.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          className={`menu-item ${activeIndex === i ? "active" : ""}`}
          onClick={() => setActiveIndex(i)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
