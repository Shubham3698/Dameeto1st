import { useState, useEffect } from "react";

export default function EventPopup() {

  const popups = [
    {
      id: 1,
      title: "🔥 Big Offer",
      text: "Buy 2 Stickers get 1 Free!",
    },
    {
      id: 2,
      title: "🚀 New Product",
      text: "Learning Kits now available",
    },
    {
      id: 3,
      title: "🎁 Special",
      text: "Free delivery above ₹499",
    },
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);


  const closePopup = () => {

    setVisible(false);

    setTimeout(() => {
      if (index < popups.length - 1) {
        setIndex(index + 1);
        setVisible(true);
      }
    }, 300);
  };

  if (!visible) return null;

  const popup = popups[index];

  return (
    <div style={overlay}>
      <div style={card}>
        <button style={closeBtn} onClick={closePopup}>✖</button>

        <h2>{popup.title}</h2>
        <p>{popup.text}</p>

        <button style={actionBtn}>
          Explore
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const card = {
  width: "320px",
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "12px",
  border: "none",
  background: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const actionBtn = {
  marginTop: "15px",
  background: "#fe3d00",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};