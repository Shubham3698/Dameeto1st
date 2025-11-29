import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function BottomMenu({ items }) {
  const location = useLocation();
  const menuRef = useRef(null);

  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  // Instagram-style scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll) setShow(false);
      else setShow(true);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Auto scroll active menu item
  useEffect(() => {
    const timeout = setTimeout(() => {
      const activeItem = menuRef.current.querySelector(".active");
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const data = items || [
    { label: "Trending", path: "/" },
    { label: "About us", path: "/about" },
    { label: "Sticker", path: "/sticker" },
    { label: "Poster", path: "/poster" },
    { label: "Goodies", path: "/goodies" },
    { label: "Marvel", path: "/marvel" },
    { label: "Heroic", path: "/heroic" },
    { label: "Gadgets", path: "/gadgets" },
    { label: "Photography", path: "/photo" },
    { label: "Aesthetic", path: "/aesthetic" },
    { label: "Art", path: "/art" },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: "60px", // below top navbar
        left: 0,
        width: "100vw",
        height: "50px",
        backgroundColor: "#fff3eb",
        display: "flex",
        overflowX: "auto",
        whiteSpace: "nowrap",
        alignItems: "center",
        paddingLeft: "8px",
        zIndex: 9998,
        transition: "transform 0.3s ease",
        transform: show ? "translateY(0)" : "translateY(-100%)",
      }}
      className="horizontal-menu"
    >
      <style>
        {`
        .horizontal-menu::-webkit-scrollbar {
          display: none;
        }
        .menu-item {
          font-family: 'Baloo 2', cursive;
          padding: 0 14px;
          margin-right: 14px;
          font-size: 18px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          font-weight: 700;
          text-decoration: none;
          color: #fe3d00;
          position: relative;
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
          transition: width 0.3s ease;
        }
        .menu-item:hover::after,
        .menu-item.active::after {
          width: 60%;
        }
        `}
      </style>

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
