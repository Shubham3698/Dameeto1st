import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search-results?query=${query}`);
    }
  };

  return (
    <div style={{ paddingTop: "70px", padding: "16px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            width: "90%",
            maxWidth: "450px",
            padding: "10px 15px",
            fontSize: "16px",
            borderRadius: "25px",
            border: "1px solid #fe3d00",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}
