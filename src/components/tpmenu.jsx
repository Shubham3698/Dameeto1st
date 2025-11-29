import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function HorizontalTopMenu({ items }) {
  const location = useLocation(); // <-- yaha path mil jayega

  const data = items || [
    { label: "Trending", path: "/" },
    { label: "About us", path: "/about" },
    { label: "Sticker", path: "/sticker" },
    { label: "Poster", path: "/poster" },
    { label: "Goodies", path: "/goodies" },
    { label: "Marval", path: "/marvel" },
    { label: "Heroic", path: "/heroic" },
    { label: "Gadgets", path: "/gadgets" },
    { label: "Photography", path: "/photo" },
    { label: "Aeshthetic", path: "/aesthetic" },
    { label: "Art", path: "/art" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",
        backgroundColor: "#fff3eb",
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
          padding: 0 12px;
          margin-right: 14px;
          font-size: 18px;
          height: 36px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          color: #fe3d00;
        }

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

        .menu-item:hover::after {
          width: 60%;
          opacity: 0.6;
        }

        .menu-item.active::after {
          width: 60%;
          opacity: 1;
        }
      `}</style>

      {data.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          className={`menu-item ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
