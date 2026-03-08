import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Nwmasonry({ images = [], categoryName }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [loopImages, setLoopImages] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [idleOffset, setIdleOffset] = useState(0);
  const [collapse, setCollapse] = useState(0);
  
  const velocityRef = useRef(0);
  // ✅ FIX: Initial value null rakhi hai taaki render impure na ho
  const lastScroll = useRef(null); 

  useLayoutEffect(() => {
    // Scroll aur Time ko client-side par initialize karna safe hai
    lastScroll.current = Date.now();

    const withRandom = images.map((item) => ({
      ...item,
      randomKey: Math.random(),
      randomRotate: (Math.random() - 0.5) * 8,
      randomTranslateX: (Math.random() - 0.5) * 20,
      randomScale: 0.95 + Math.random() * 0.1,
      depth: 0.2 + Math.random() * 0.5,
      pushDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const shuffled = [...withRandom].sort((a, b) => a.randomKey - b.randomKey);
    setLoopImages([...shuffled, ...shuffled, ...shuffled]);
  }, [images]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrollY(scrollTop);
      lastScroll.current = Date.now(); // Update scroll time

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

  useEffect(() => {
    let raf;
    const animate = () => {
      if (!lastScroll.current) return;

      const idleTime = Date.now() - lastScroll.current;
      if (idleTime > 2000) {
        velocityRef.current += 0.04;
        setIdleOffset((prev) => {
          let next = prev + velocityRef.current;
          if (next > 120) {
            next = 120;
            velocityRef.current *= -0.45;
          }
          return next;
        });
        setCollapse((prev) => Math.min(prev + 2, 120));
      } else {
        setCollapse((prev) => prev * 0.85);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (item) => {
    if (!item?.id) return;
    navigate(`/image/${item.id}`, {
      state: { item, category: categoryName, images },
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: "#fff3eb",
        height: "100vh",
        overflowY: "auto",
        perspective: "1200px",
      }}
      className="container py-4"
    >
      <div className="masonry">
        {loopImages.map((item, i) => {
          const floatOffset = scrollY * item.depth * 0.02;
          const push = Math.sin(scrollY * 0.02 + i) * 6 * item.pushDir;

          return (
            <motion.div
              key={`${item.id}-${i}`}
              className="image-wrapper"
              drag
              dragSnapToOrigin
              whileTap={{ scale: 1.1, zIndex: 10, cursor: "grabbing" }}
              animate={{
                y: floatOffset + idleOffset + collapse,
                x: item.randomTranslateX + push,
                rotate: item.randomRotate,
                scale: item.randomScale,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {item.badge && (
                <div className="badge-custom">
                  <div className={`badge-text ${item.badge.length > 4 ? "scroll-text" : ""}`}>
                    {item.badge}
                  </div>
                </div>
              )}
              <img
                src={item.src}
                alt={item.title}
                draggable="false"
                onClick={() => handleClick(item)}
                style={{ width: "100%", borderRadius: "14px", display: "block" }}
              />
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .masonry {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          padding-bottom: 100px;
        }
        @media (min-width:768px) { .masonry { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width:992px) { .masonry { grid-template-columns: repeat(4, 1fr); } }

        .image-wrapper { position: relative; cursor: grab; touch-action: none; }
        .badge-custom {
          position: absolute; top: 8px; left: 8px; width: 35px; height: 18px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; font-size: 7px; font-weight: 700; border-radius: 6px;
          color: white; z-index: 2; animation: rgbFlow 4s linear infinite;
        }
        .badge-text { white-space: nowrap; }
        .scroll-text { display: inline-block; padding-left: 100%; animation: scrollText 5s linear infinite; }
        @keyframes scrollText { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @keyframes rgbFlow {
          0% { background: #ff3c3c; }
          33% { background: #ff783c; }
          66% { background: #c83cff; }
          100% { background: #ff3c3c; }
        }
      `}</style>
    </div>
  );
}