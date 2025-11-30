import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Scroll down → hide navbar
      if (currentScroll > lastScroll) {
        setShow(false);
      } 
      // Scroll up → show navbar
      else {
        setShow(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#ce0000ff",
        padding: "12px 0",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-around",
        transition: "transform 0.3s ease",
        transform: show ? "translateY(0)" : "translateY(100%)",
        zIndex: 999,
      }}
    >
      <button>Home</button>
      <button>Search</button>
      <button>Reels</button>
      <button>Profile</button>
    </div>
  );
}
