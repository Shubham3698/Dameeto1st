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
    dragStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

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

      if (scrollTop >= oneThird * 2) {
        container.scrollTop = scrollTop - oneThird;
      } else if (scrollTop <= 5) {
        container.scrollTop = scrollTop + oneThird;
      }
    };

    setTimeout(() => {
      if (container.scrollHeight > 0) {
        container.scrollTop = container.scrollHeight / 3;
      }
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

          if (next > 120) {
            next = 120;
            velocityRef.current *= -0.45;
          }

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
      className="h-screen w-full overflow-y-auto bg-[#fff3eb] py-4 no-scrollbar"
      style={{ perspective: "1000px" }}
    >
      <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4">
        {loopImages.map((item, i) => {
          const floatOffset = scrollY * item.depth * 0.006; // 30% of original
          const push = Math.sin(scrollY * 0.02 + i) * 2 * item.pushDir; // 30% of original

          let dragX = dragIndex === i ? dragOffset.x * 0.3 : 0; // 30% drag
          let dragY = dragIndex === i ? dragOffset.y * 0.3 : 0; // 30% drag

          const isTouch = touchIndex === i;

          return (
            <div
              key={i}
              onMouseDown={(e) => handleMouseDown(e, i)}
              onTouchStart={(e) => handleTouchStart(e, i)}
              className="group relative cursor-grab active:cursor-grabbing"
              style={{
                transition:
                  dragIndex === i
                    ? "none"
                    : "transform .35s cubic-bezier(.22,1,.36,1)",
                transform: `
                  translateY(${floatOffset + idleOffset + dragY + collapse}px)
                  translateX(${item.randomTranslateX + push + dragX}px)
                  rotate(${item.randomRotate}deg)
                  scale(${item.randomScale})
                `,
              }}
            >
              <img
                src={item.src}
                alt={item.title}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => {
                  const now = Date.now();

                  if (now - lastTapRef.current < 300) {
                    handleClick(item);
                  } else {
                    setTouchIndex(i);
                  }

                  lastTapRef.current = now;
                }}
                onDoubleClick={() => handleClick(item)}
                className={`w-full rounded-[14px] transition-all duration-500 ${
                  isTouch
                    ? "scale-[1.1] shadow-2xl shadow-black/30 grayscale-0 opacity-100 z-50"
                    : "grayscale-[30%] opacity-[0.85] group-hover:scale-[1.08] group-hover:shadow-xl group-hover:shadow-black/20 group-hover:grayscale-0 group-hover:opacity-100 group-hover:z-50"
                }`}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
        img { -webkit-user-drag:none; user-select:none; }
      `}</style>
    </div>
  );
}