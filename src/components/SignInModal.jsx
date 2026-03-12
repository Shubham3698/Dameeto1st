import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";

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
  const [success, setSuccess] = useState(""); 
  const [loading, setLoading] = useState(false);

  // 🔥 DYNAMIC API URL (Local vs Production)
  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // --- FORGOT PASSWORD LOGIC ---
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset link sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError("Reset error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Email & password are required");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) { setError("Name is required"); setLoading(false); return; }
      if (email !== confirmEmail) { setError("Emails do not match"); setLoading(false); return; }
      if (password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
      if (password.length < 6) { setError("Password: Min 6 characters"); setLoading(false); return; }
    }

    try {
      let userCredential;

      if (!isLogin) {
        // 1. Firebase Signup
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Send Verification Email
        await sendEmailVerification(userCredential.user);
        
        // 3. Sync with MongoDB
        const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name, 
            email, 
            password, 
            firebaseUid: userCredential.user.uid 
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Backend sync failed");
        }
        
        setSuccess("Verification email sent! Please check your inbox.");
        setLoading(false);
      } else {
        // 4. LOGIN FLOW
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 5. Check if Verified
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email first. Check your inbox.");
          setLoading(false);
          return;
        }

        // 6. Backend Login Check
        const res = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userName", data.name);
          window.location.href = "/account";
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- OTP LOGIC ---
  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      }
      const formattedPhone = phone.startsWith("+") ? phone : "+91" + phone;
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmation(result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
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
      setError("Invalid OTP");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={headingStyle}>
          {isPhoneLogin ? "Phone Login" : isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <div style={switchWrapper}>
          <button type="button" onClick={() => { setIsPhoneLogin(false); setError(""); setSuccess(""); }} style={{...switchBtn, ...(!isPhoneLogin ? activeSwitch : {})}}>Email</button>
          <button type="button" onClick={() => { setIsPhoneLogin(true); setError(""); setSuccess(""); }} style={{...switchBtn, ...(isPhoneLogin ? activeSwitch : {})}}>Phone</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isPhoneLogin && (
            <>
              {!isLogin && <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />}
              <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              {!isLogin && <input placeholder="Confirm Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} style={inputStyle} />}
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              {!isLogin && <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />}
              
              <button type="submit" style={primaryBtn} disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up & Verify"}
              </button>

              {isLogin && (
                <p style={forgotText} onClick={handleForgotPassword}>
                  Forgot Password?
                </p>
              )}
            </>
          )}

          {isPhoneLogin && (
            <>
              <input placeholder="Enter Phone (e.g. 9876543210)" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} disabled={!!confirmation} />
              {!confirmation ? (
                <button type="button" onClick={sendOtp} style={primaryBtn} disabled={loading}>Send OTP</button>
              ) : (
                <>
                  <input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={inputStyle} />
                  <button type="button" onClick={verifyOtp} style={primaryBtn} disabled={loading}>Verify OTP</button>
                </>
              )}
              <div id="recaptcha-container"></div>
            </>
          )}

          <button type="button" onClick={onClose} style={secondaryBtn}>Cancel</button>

          {!isPhoneLogin && (
            <p style={bottomText} onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}>
              {isLogin ? "New here? Create an Account" : "Already have an account? Login"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// --- UPDATED STYLES ---
const successStyle = { color: "#28a745", fontSize: "13px", marginBottom: "12px", textAlign: "center", background: "#e8f5e9", padding: "10px", borderRadius: "8px" };
const errorStyle = { color: "#ff3b3b", fontSize: "13px", marginBottom: "12px", textAlign: "center", background: "#ffebee", padding: "10px", borderRadius: "8px" };
const forgotText = { textAlign: "center", color: "#666", fontSize: "12px", cursor: "pointer", marginTop: "5px", textDecoration: "underline" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" };
const modalStyle = { background: "#ffffff", width: "90%", maxWidth: "400px", padding: "25px", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" };
const headingStyle = { textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "20px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #eee", fontSize: "14px", boxSizing: "border-box" };
const primaryBtn = { width: "100%", padding: "12px", background: "linear-gradient(135deg, #fe3d00, #ff6a00)", border: "none", color: "#fff", fontWeight: "600", borderRadius: "10px", cursor: "pointer", marginBottom: "10px" };
const secondaryBtn = { width: "100%", padding: "12px", background: "transparent", border: "1px solid #fe3d00", color: "#fe3d00", borderRadius: "10px", cursor: "pointer" };
const switchWrapper = { display: "flex", background: "#f8f8f8", borderRadius: "10px", padding: "4px", marginBottom: "20px" };
const switchBtn = { flex: 1, padding: "10px", border: "none", background: "transparent", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" };
const activeSwitch = { background: "#fe3d00", color: "#fff" };
const bottomText = { textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#fe3d00", cursor: "pointer", fontWeight: "500" };