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
        height: "50px",
        backgroundColor: "#dedede",
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
          backgroun: #fffff;
          display: inline-block;
          margin-right: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          padding: 6px 10px;
          text-decoration: none;
          color: #fe3b01;
          // border: 1px solid #fe3b01;
          border-radius: 6px;
          transition: 0.2s ease;

        }

        .menu-item:hover {
          background-color: #ffff;
          // color: #ffffff;
        }

        .menu-item.active {
          border: 3px solid #fe3b01 !important;
          color: #000000ff;
          background: white
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
