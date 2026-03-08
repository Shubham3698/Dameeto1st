import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nwmasonry({ images = [], categoryName }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // 🔹 Helper function: shuffle + random transforms
  const generateLoopImages = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    const withRandom = shuffled.map(item => ({
      ...item,
      randomRotate: (Math.random() - 0.5) * 4,
      randomTranslateX: (Math.random() - 0.5) * 8,
      randomTranslateY: (Math.random() - 0.5) * 8,
    }));
    return [...withRandom, ...withRandom, ...withRandom];
  };

  // 🔹 Initialize state once
  const [loopImages] = useState(generateLoopImages);

  const handleClick = (item) => {
    if (!item?.id) return;
    navigate(`/image/${item.id}`, { state: { item, category: categoryName, images } });
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const visibleHeight = container.clientHeight;

      if (scrollTop + visibleHeight >= scrollHeight - 5) {
        container.scrollTop = scrollTop - scrollHeight / 3;
      }
    };

    setTimeout(() => (container.scrollTop = container.scrollHeight / 3), 100);

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ background: "#fff3eb", height: "100vh", overflowY: "auto" }} className="container py-4">
      <style>{`
        .masonry { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 768px) { .masonry { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 992px) { .masonry { grid-template-columns: repeat(4, 1fr); } }
        .image-wrapper { position: relative; break-inside: avoid; }
        .masonry img { width: 100%; border-radius: 14px; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .masonry img:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.22); }
        .badge-custom { position: absolute; top: 6px; left: 6px; width: 30px; height: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 7px; font-weight: 600; border-radius: 8px; color: white; text-transform: uppercase; letter-spacing: 0.3px; animation: rgbFlow 4s linear infinite; }
        .badge-text { white-space: nowrap; }
        .scroll-text { display: inline-block; padding-left: 100%; animation: scrollText 5s linear infinite; }
        @keyframes scrollText { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @keyframes rgbFlow { 0% { background: rgb(255, 60, 60); } 25% { background: rgb(255, 120, 60); } 50% { background: rgb(255, 60, 140); } 75% { background: rgb(200, 60, 255); } 100% { background: rgb(255, 60, 60); } }
      `}</style>

      <div className="masonry">
        {loopImages.map((item, i) => {
          const isLongText = item.badge && item.badge.length > 4;
          return (
            <div
              key={i}
              className="image-wrapper"
              style={{ transform: `rotate(${item.randomRotate}deg) translate(${item.randomTranslateX}px, ${item.randomTranslateY}px)` }}
            >
              {item.badge && (
                <div className="badge-custom">
                  <div className={`badge-text ${isLongText ? "scroll-text" : ""}`}>{item.badge}</div>
                </div>
              )}
              <img src={item.src} alt={item.title} onClick={() => handleClick(item)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}