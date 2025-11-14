import React from "react";

function Header() {
  return (
    <header
      className="d-flex align-items-center border-bottom"
      style={{
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        zIndex: 10,
        padding: "12px 18px",
        gap: "12px",
      }}
    >
      <h1
        className="m-0 fw-semibold"
        style={{
          fontSize: "18px",
          letterSpacing: "0.2px",
        }}
      >
        @Dameeto
      </h1>

      <div
        className="ms-auto text-secondary"
        style={{
          fontSize: "13px",
        }}
      >
        Scroll to explore • Tap to flip🪄
      </div>
    </header>
  );
}

export default Header;
