import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nwmasonry({ images }) {
  const navigate = useNavigate();

  const handleClick = (src) => {
    navigate("/image-details", { state: { src } });
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

        .masonry img {
          width: 100%;
          margin-bottom: 12px;
          border-radius: 14px;
          break-inside: avoid;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.12);
          cursor: pointer;
        }

        .masonry img:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0,0,0,0.22);
        }
      `}</style>

      <div className="masonry">
        {images?.map((src, i) => (
          <img key={i} src={src} alt="" onClick={() => handleClick(src)} />
        ))}
      </div>
    </div>
  );
}
