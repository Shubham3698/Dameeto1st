import React, { useState } from "react";

export default function SignInModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email & password required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format");
    }

    // Signup validation
    if (!isLogin) {
      if (!name) return setError("Name is required");
      if (email !== confirmEmail) return setError("Emails do not match");
      if (password !== confirmPassword) return setError("Passwords do not match");
    }

    try {
      const url = isLogin
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/signup";

      const body = isLogin
        ? { email, password }     // 🔥 Login me sirf email + password
        : { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Something went wrong");
      }

      // 🔥 IMPORTANT: Name + Email dono save karo
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);

      // Redirect
      window.location.href = "/account";

    } catch  {
      setError("Server error, try again");
    }
  };

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={modalStyle}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {!isLogin && (
          <input
            placeholder="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        <button type="submit" style={submitStyle}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button type="button" onClick={onClose} style={cancelStyle}>
          Cancel
        </button>

        <p
          style={toggleStyle}
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "320px",
};

const inputStyle = {
  width: "100%",
  marginBottom: "8px",
  padding: "8px",
};

const submitStyle = {
  width: "100%",
  padding: "8px",
  backgroundColor: "#fe3d00",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginBottom: "6px",
};

const cancelStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #fe3d00",
  borderRadius: "6px",
};

const toggleStyle = {
  textAlign: "center",
  marginTop: "10px",
  cursor: "pointer",
  color: "#fe3d00",
};