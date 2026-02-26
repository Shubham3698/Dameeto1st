import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function SignInModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email & password required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) { setError("Name is required"); setLoading(false); return; }
      if (email !== confirmEmail) { setError("Emails do not match"); setLoading(false); return; }
      if (password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
    }

    try {
      const url = isLogin
        ? "https://serdeptry1st.onrender.com/api/users/login"
        : "https://serdeptry1st.onrender.com/api/users/signup";

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);
      window.location.href = "/account";
    } catch {
      setError("Server error, try again");
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
            "expired-callback": () => {
              setError("reCAPTCHA expired. Try again.");
            }
          }
        );
      }

      const formattedPhone = phone.startsWith("+") ? phone : "+91" + phone;
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to send OTP");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await confirmation.confirm(otp);
      localStorage.setItem("userPhone", result.user.phoneNumber);
      window.location.href = "/account";
    } catch {
      setLoading(false);
      setError("Invalid OTP or expired");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={headingStyle}>
          {isPhoneLogin ? "Phone Login" : isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={switchWrapper}>
          <button
            type="button"
            onClick={() => { setIsPhoneLogin(false); setError(""); }}
            style={{
              ...switchBtn,
              ...( !isPhoneLogin ? activeSwitch : {} )
            }}
          >
            Email
          </button>

          <button
            type="button"
            onClick={() => { setIsPhoneLogin(true); setError(""); }}
            style={{
              ...switchBtn,
              ...( isPhoneLogin ? activeSwitch : {} )
            }}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {!isPhoneLogin && (
            <>
              {!isLogin && (
                <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              )}

              <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

              {!isLogin && (
                <input placeholder="Confirm Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} style={inputStyle} />
              )}

              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

              {!isLogin && (
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
              )}

              <button type="submit" style={primaryBtn} disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </>
          )}

          {isPhoneLogin && (
            <>
              <input
                placeholder="Enter Phone (9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                disabled={!!confirmation}
              />

              {!confirmation ? (
                <button type="button" onClick={sendOtp} style={primaryBtn} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={inputStyle}
                  />
                  <button type="button" onClick={verifyOtp} style={primaryBtn} disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              <div id="recaptcha-container"></div>
            </>
          )}

          <button type="button" onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>

          {!isPhoneLogin && (
            <p
              style={bottomText}
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backdropFilter: "blur(4px)"
};

const modalStyle = {
  background: "#ffffff",
  width: "100%",
  maxWidth: "420px",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.3s ease"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontWeight: "700",
  fontSize: "22px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none"
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #fe3d00, #ff6a00)",
  border: "none",
  color: "#fff",
  fontWeight: "600",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "10px"
};

const secondaryBtn = {
  width: "100%",
  padding: "10px",
  background: "transparent",
  border: "1px solid #fe3d00",
  color: "#fe3d00",
  borderRadius: "10px",
  cursor: "pointer"
};

const errorStyle = {
  color: "#ff3b3b",
  fontSize: "13px",
  marginBottom: "10px",
  textAlign: "center"
};

const switchWrapper = {
  display: "flex",
  background: "#f3f3f3",
  borderRadius: "10px",
  padding: "4px",
  marginBottom: "18px"
};

const switchBtn = {
  flex: 1,
  padding: "8px",
  border: "none",
  background: "transparent",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const activeSwitch = {
  background: "#fe3d00",
  color: "#fff"
};

const bottomText = {
  textAlign: "center",
  marginTop: "15px",
  fontSize: "14px",
  color: "#fe3d00",
  cursor: "pointer"
};