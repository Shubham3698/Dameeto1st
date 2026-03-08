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

  useLayoutEffect(() => {

    const withRandom = images.map(item => ({
      ...item,
      randomKey: Math.random(),
      randomRotate: (Math.random() - 0.5) * 8,
      randomTranslateX: (Math.random() - 0.5) * 20,
      randomScale: 0.95 + Math.random() * 0.1,
      depth: 0.2 + Math.random() * 0.5,
      pushDir: Math.random() > 0.5 ? 1 : -1
    }));

    const shuffled = [...withRandom].sort((a, b) => a.randomKey - b.randomKey);

    setTimeout(() => {
      setLoopImages([...shuffled, ...shuffled, ...shuffled]);
    }, 0);

  }, [images]);

  const handleClick = (item) => {
    if (!item?.id) return;
    navigate(`/image/${item.id}`, {
      state: { item, category: categoryName, images }
    });
  };

  const handleMouseDown = (e, index) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragIndex(index);
  };

  useEffect(() => {

    const move = (e) => {

      if (dragIndex === null) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      setDragOffset({ x: dx, y: dy });

    };

    const up = () => {
      setDragIndex(null);
      setDragOffset({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

  }, [dragIndex]);

  useEffect(() => {

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {

      const scrollTop = container.scrollTop;

      setScrollY(scrollTop);
      lastScroll.current = Date.now();

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

      const idleTime = Date.now() - lastScroll.current;

      if (idleTime > 2000) {

        velocityRef.current += 0.04;

        setIdleOffset(prev => {

          let next = prev + velocityRef.current;

          const floor = 120;

          if (next > floor) {
            next = floor;
            velocityRef.current *= -0.45;
          }

          return next;

        });

        setCollapse(prev => Math.min(prev + 2, 120));

      } else {

        setCollapse(prev => prev * 0.85);

      }

      raf = requestAnimationFrame(animate);

    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);

  }, []);

  useEffect(() => {

    const move = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);

  }, []);

  return (

    <div
      ref={containerRef}
      style={{
        background: "#fff3eb",
        height: "100vh",
        overflowY: "auto",
        perspective: "900px"
      }}
      className="container py-4"
    >

      <div className="masonry">

        {loopImages.map((item, i) => {

          const floatOffset = scrollY * item.depth * 0.02;
          const push = Math.sin(scrollY * 0.02 + i) * 6 * item.pushDir;

          const rectX = (i % 4) * 200 + 100;
          const rectY = Math.floor(i / 4) * 250;

          const dx = mouse.x - rectX;
          const dy = mouse.y - rectY;

          const dist = Math.sqrt(dx * dx + dy * dy);

          let magnetX = 0;
          let magnetY = 0;

          if (dist < 180) {
            magnetX = dx * 0.05;
            magnetY = dy * 0.05;
          }

          let dragX = 0;
          let dragY = 0;

          if (dragIndex === i) {
            dragX = dragOffset.x;
            dragY = dragOffset.y;
          }

          return (

            <div
              key={i}
              className="image-wrapper"
              style={{
                transition: dragIndex === i ? "none" : "transform .2s ease-out",
                transform: `
                  translateY(${floatOffset + idleOffset + magnetY + dragY + collapse}px)
                  translateX(${item.randomTranslateX + push + magnetX + dragX}px)
                  rotate(${item.randomRotate}deg)
                  scale(${item.randomScale})
                `
              }}
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
                onMouseDown={(e) => handleMouseDown(e, i)}
              />

            </div>

          );

        })}

      </div>

      <style>{`

        .masonry{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:12px;
        }

        @media (min-width:768px){
          .masonry{grid-template-columns:repeat(3,1fr);}
        }

        @media (min-width:992px){
          .masonry{grid-template-columns:repeat(4,1fr);}
        }

        .image-wrapper{
          position:relative;
          break-inside:avoid;
          cursor:grab;
        }

        .image-wrapper:active{
          cursor:grabbing;
        }

        .masonry img{
          width:100%;
          border-radius:14px;
          transition:transform .3s ease, box-shadow .3s ease;
        }

        .masonry img:hover{
          transform:scale(1.06);
          box-shadow:0 12px 22px rgba(0,0,0,.25);
        }

        .badge-custom{
          position:absolute;
          top:6px;
          left:6px;
          width:30px;
          height:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          font-size:7px;
          font-weight:600;
          border-radius:8px;
          color:white;
          text-transform:uppercase;
          letter-spacing:.3px;
          animation:rgbFlow 4s linear infinite;
        }

        .badge-text{
          white-space:nowrap;
        }

        .scroll-text{
          display:inline-block;
          padding-left:100%;
          animation:scrollText 5s linear infinite;
        }

        @keyframes scrollText{
          0%{transform:translateX(0);}
          100%{transform:translateX(-100%);}
        }

        @keyframes rgbFlow{
          0%{background:rgb(255,60,60);}
          25%{background:rgb(255,120,60);}
          50%{background:rgb(255,60,140);}
          75%{background:rgb(200,60,255);}
          100%{background:rgb(255,60,60);}
        }

      `}</style>

    </div>

  );

}