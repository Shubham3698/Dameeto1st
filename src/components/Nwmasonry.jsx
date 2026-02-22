import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nwmasonry({ images, categoryName }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate("/image-details", {
      state: {
        item,
        category: categoryName,
        images,
      },
    });
  };

  return (
    <div style={{ background: "#fff3eb" }} className="container py-4">
      
      <style>{`
        .masonry {
          column-count: 1;
          column-gap: 12px;
        }

        @media (max-width: 600px) {
          .masonry {
            column-count: 2 !important;
          }
        }

        @media (min-width: 768px) {
          .masonry {
            column-count: 3;
          }
        }

        @media (min-width: 992px) {
          .masonry {
            column-count: 4;
          }
        }

        .image-wrapper {
          position: relative;
          break-inside: avoid;
          margin-bottom: 12px;
        }

        .masonry img {
          width: 100%;
          border-radius: 14px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .masonry img:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0,0,0,0.22);
        }

        /* 🔥 30px Fixed Badge */
        .badge-custom {
          position: absolute;
          top: 6px;
          left: 6px;

          width: 30px;
          height: 18px;

          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          font-size: 7px;
          font-weight: 600;
          border-radius: 8px;
          color: white;
          z-index: 2;
          text-transform: uppercase;
          letter-spacing: 0.3px;

          animation: rgbFlow 4s linear infinite;
        }

        .badge-text {
          white-space: nowrap;
        }

        /* Scroll only when needed */
        .scroll-text {
          display: inline-block;
          padding-left: 100%;
          animation: scrollText 5s linear infinite;
        }

        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        @keyframes rgbFlow {
          0% { background: rgb(255, 60, 60); }
          25% { background: rgb(255, 120, 60); }
          50% { background: rgb(255, 60, 140); }
          75% { background: rgb(200, 60, 255); }
          100% { background: rgb(255, 60, 60); }
        }
      `}</style>

      <div className="masonry">
        {images?.map((item, i) => {
          const isLongText =
            item.badge && item.badge.length > 4; // 30px width ke hisaab se

          return (
            <div key={i} className="image-wrapper">
              
              {item.badge && (
                <div className="badge-custom">
                  <div
                    className={`badge-text ${
                      isLongText ? "scroll-text" : ""
                    }`}
                  >
                    {item.badge}
                  </div>
                </div>
              )}

              <img
                src={item.src}
                alt={item.title}
                onClick={() => handleClick(item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}