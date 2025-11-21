// HorizontalTopMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HorizontalTopMenu({ items }) {
  const data = items || [
    { label: "Home", path: "/" },
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
        height: "50px",
        backgroundColor: "#fff",
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        scrollBehavior: "smooth",
        zIndex: 9999,
      }}
      className="horizontal-menu"
      tabIndex={-1}
    >
      <style>{`
        .horizontal-menu::-webkit-scrollbar {
          display: none;
        }
        .horizontal-menu {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .menu-item {
          display: inline-block;
          margin-right: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          padding-bottom: 4px;
          text-decoration: none;
          color: black;
        }

        .menu-item.active {
          border-bottom: 2px solid red;
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
