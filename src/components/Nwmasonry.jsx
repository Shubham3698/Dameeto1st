import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Nwmasonry({ images = [], categoryName }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [loopImages, setLoopImages] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [idleOffset, setIdleOffset] = useState(0);
  const [collapse, setCollapse] = useState(0);

  const velocityRef = useRef(0);
  const lastScroll = useRef(Date.now());

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const [touchIndex, setTouchIndex] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const lastTapRef = useRef(0);
  const holdTimer = useRef(null);

  useLayoutEffect(() => {
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
    setTimeout(() => {
      setLoopImages([...shuffled, ...shuffled, ...shuffled]);
    }, 0);
  }, [images]);

  const handleClick = (item) => {
    if (!item?.id) return;
    navigate(`/image/${item.id}`, {
      state: { item, category: categoryName, images },
    });
  };

  const handleMouseDown = (e, index) => {
    setIsHolding(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragIndex(index);
  };

  const handleTouchStart = (e, index) => {
    setIsHolding(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    holdTimer.current = setTimeout(() => {
      setDragIndex(index);
    }, 250);
  };

  useEffect(() => {
    const move = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setMouse({ x: clientX, y: clientY });
      if (dragIndex === null) return;
      setDragOffset({
        x: clientX - dragStart.current.x,
        y: clientY - dragStart.current.y,
      });
    };
    const up = () => {
      clearTimeout(holdTimer.current);
      setIsHolding(false);
      setDragIndex(null);
      setDragOffset({ x: 0, y: 0 });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      setScrollY(scrollTop);
      lastScroll.current = Date.now();
      const oneThird = scrollHeight / 3;
      if (scrollTop >= oneThird * 2) container.scrollTop = scrollTop - oneThird;
      else if (scrollTop <= 5) container.scrollTop = scrollTop + oneThird;
    };
    setTimeout(() => {
      if (container.scrollHeight > 0) container.scrollTop = container.scrollHeight / 3;
    }, 150);
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loopImages.length]);

  useEffect(() => {
    let raf;
    const animate = () => {
      const idleTime = Date.now() - lastScroll.current;
      if (idleTime > 2000 && !isHolding) {
        velocityRef.current += 0.04;
        setIdleOffset((prev) => {
          let next = prev + velocityRef.current;
          if (next > 120) { next = 120; velocityRef.current *= -0.45; }
          return next;
        });
        setCollapse((prev) => Math.min(prev + 2, 120));
      } else if (!isHolding) {
        setCollapse((prev) => prev * 0.85);
        setIdleOffset((prev) => prev * 0.8);
        velocityRef.current = 0;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isHolding]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto bg-[#fff3eb] py-4 no-scrollbar selection:bg-none"
      style={{ perspective: "1000px", scrollBehavior: "auto", WebkitTouchCallout: "none" }}
    >
      <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4">
        {loopImages.map((item, i) => {
          const floatOffset = scrollY * item.depth * 0.02;
          const push = Math.sin(scrollY * 0.02 + i) * 6 * item.pushDir;
          const rectX = (i % 4) * 200 + 100;
          const rectY = Math.floor(i / 4) * 250 - (scrollY % (containerRef.current?.scrollHeight / 3 || 1));
          
          const dx = mouse.x - rectX;
          const dy = mouse.y - rectY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let magnetX = 0, magnetY = 0;
          if (dist < 180) { magnetX = dx * 0.05; magnetY = dy * 0.05; }

          let dragX = dragIndex === i ? dragOffset.x : 0;
          let dragY = dragIndex === i ? dragOffset.y : 0;
          const isTouch = touchIndex === i;

          return (
            <div
              key={i}
              onMouseDown={(e) => handleMouseDown(e, i)}
              onTouchStart={(e) => handleTouchStart(e, i)}
              className="group relative cursor-grab active:cursor-grabbing"
              style={{
                transition: dragIndex === i || Date.now() - lastScroll.current > 2000 ? "transform .3s ease-out" : "none",
                willChange: "transform",
                transform: `translateY(${floatOffset + idleOffset + magnetY + dragY + collapse}px) translateX(${item.randomTranslateX + push + magnetX + dragX}px) rotate(${item.randomRotate}deg) scale(${item.randomScale})`,
              }}
            >
              {item.badge && (
                <div className={`absolute left-[6px] top-[6px] z-10 flex h-[18px] w-[30px] items-center justify-center overflow-hidden rounded-lg text-[7px] font-semibold uppercase tracking-wider text-white animate-rgb-flow transition-opacity duration-300 ${isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <div className={`whitespace-nowrap ${item.badge.length > 4 ? "animate-scroll-text pl-[100%]" : ""}`}>{item.badge}</div>
                </div>
              )}
              <img
                src={item.src} alt={item.title} draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => {
                  const now = Date.now();
                  if (now - lastTapRef.current < 300) handleClick(item);
                  else setTouchIndex(i);
                  lastTapRef.current = now;
                }}
                onDoubleClick={() => handleClick(item)}
                // Yahan maine grayscale 70% aur opacity 70% kar di hai (Line below)
                className={`w-full rounded-[14px] border-none shadow-none transition-all duration-500 ease-out ${isTouch ? "scale-[1.1] shadow-2xl shadow-black/30 grayscale-0 opacity-100 z-50" : "grayscale-[70%] opacity-70 group-hover:scale-[1.1] group-hover:shadow-2xl group-hover:shadow-black/30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:z-50"}`}
              />
            </div>
          );
        })}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        img { -webkit-user-drag:none; user-select:none; -webkit-touch-callout:none; }
        @keyframes rgb-flow {
          0% { background: rgb(255, 60, 60); }
          25% { background: rgb(255, 120, 60); }
          50% { background: rgb(255, 60, 140); }
          75% { background: rgb(200, 60, 255); }
          100% { background: rgb(255, 60, 60); }
        }
        @keyframes scroll-text {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-rgb-flow { animation: rgb-flow 4s linear infinite; }
        .animate-scroll-text { animation: scroll-text 5s linear infinite; }
      `}</style>
    </div>
  );
}