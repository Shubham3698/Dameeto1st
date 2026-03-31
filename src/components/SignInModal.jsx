import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; 
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export default function SignInModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  useEffect(() => {
    let interval;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsVerifying(false);
        if (interval) clearInterval(interval);
        return;
      }
      if (user && isVerifying && !isLogin && !isPhoneLogin) {
        interval = setInterval(async () => {
          try {
            await user.reload();
            if (user.emailVerified) {
              clearInterval(interval);
              setIsVerifying(false);
              const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
              });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem("userEmail", data.email);
                localStorage.setItem("userName", data.name);
                window.location.href = "/account";
              }
            }
          } catch (err) {
            console.error("Verification error:", err);
          }
        }, 3000);
      }
    });
    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isVerifying, isLogin, isPhoneLogin, API_BASE_URL]);

  // 🔥 Google Login with Double Sync (Signup + Login)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true); setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. Signup/Sync Call
      await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: user.displayName, 
          email: user.email, 
          password: "google_auth_no_password", 
          firebaseUid: user.uid 
        }),
      });

      // 2. Login Call to set isVerified: true
      const loginRes = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("userName", loginData.name);
        window.location.href = "/account";
      } else {
        throw new Error(loginData.message || "Login sync failed");
      }
    } catch (err) {
      setError("Google Login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Please enter your email address first."); return; }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset link sent! Check your inbox.");
      setError("");
    } catch (err) { setError("Reset error: " + err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    if (!email || !password) { setError("Email & password are required"); setLoading(false); return; }
    
    if (!isLogin) {
      if (!name) { setError("Name is required"); setLoading(false); return; }
      if (password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
      if (password.length < 6) { setError("Password: Min 6 characters"); setLoading(false); return; }
    }
    
    try {
      let userCredential;
      if (!isLogin) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, firebaseUid: userCredential.user.uid }),
        });
        if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Backend sync failed"); }
        setSuccess("Verification email sent! Auto-redirecting...");
        setIsVerifying(true);
        setLoading(false);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) { setError("Please verify your email first."); setLoading(false); return; }
        const res = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userName", data.name);
          window.location.href = "/account";
        } else { setError(data.message || "Login failed"); }
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const sendOtp = async () => {
    try {
      setLoading(true); setError("");
      if (!window.recaptchaVerifier) { window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" }); }
      const formattedPhone = phone.startsWith("+") ? phone : "+91" + phone;
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmation(result);
      setLoading(false);
    } catch (err) { setLoading(false); setError(err.message); }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true); setError("");
      const result = await confirmation.confirm(otp);
      const phoneEmail = result.user.phoneNumber + "@phone.com";

      // Signup/Sync Call
      await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Phone User", email: phoneEmail, password: "phone_login_no_password", firebaseUid: result.user.uid }),
      });

      // Login Call to set isVerified: true
      const loginRes = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: phoneEmail }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem("userPhone", result.user.phoneNumber);
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("userName", loginData.name);
        window.location.href = "/account";
      } else {
        setError("Login sync failed");
      }
    } catch (err) { setLoading(false); setError("Invalid OTP or Sync Failed"); }
  };

  const inputClass = "w-full p-3 mb-2.5 rounded-xl border border-gray-100 text-sm outline-none focus:border-orange-500 transition-colors bg-white font-medium";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] backdrop-blur-[4px] p-4 font-sans">
      <div className="bg-white w-full max-w-[400px] p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-center mb-6 font-bold text-2xl text-gray-800 tracking-tight">
          {isPhoneLogin ? "Phone Login" : isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && <p className="text-red-500 text-[11px] mb-4 text-center bg-red-50 p-3 rounded-xl border border-red-100 font-bold">{error}</p>}
        {success && <p className="text-green-600 text-[11px] mb-4 text-center bg-green-50 p-3 rounded-xl border border-green-100 font-bold">{success}</p>}

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button type="button" onClick={() => { setIsPhoneLogin(false); setIsVerifying(false); setError(""); setSuccess(""); }} 
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${!isPhoneLogin ? 'bg-[#fe3d00] text-white shadow-md' : 'text-gray-500'}`}>Email</button>
          <button type="button" onClick={() => { setIsPhoneLogin(true); setIsVerifying(false); setError(""); setSuccess(""); }} 
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${isPhoneLogin ? 'bg-[#fe3d00] text-white shadow-md' : 'text-gray-500'}`}>Phone</button>
        </div>

        {!isPhoneLogin && !isVerifying && (
          <div className="mb-4">
            <button type="button" onClick={handleGoogleSignIn} disabled={loading}
              className="w-full p-3 flex items-center justify-center gap-3 border-2 border-gray-50 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all mb-4 active:scale-95">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
              Continue with Google
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] bg-gray-100 flex-1"></div>
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Or</span>
              <div className="h-[1px] bg-gray-100 flex-1"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          {!isPhoneLogin ? (
            <>
              {!isLogin && <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />}
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 text-[10px] font-black uppercase">{showPassword ? "Hide" : "Show"}</button>
              </div>

              {!isLogin && <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />}
              
              <button type="submit" disabled={loading} className="w-full p-3.5 bg-gradient-to-r from-[#fe3d00] to-[#ff6a00] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 mt-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {isLogin ? "Login Now" : "Register Now"}
              </button>

              {isLogin && <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest cursor-pointer pt-3 hover:text-orange-500 transition-colors" onClick={handleForgotPassword}>Forgot Password?</p>}
            </>
          ) : (
            <>
              <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} disabled={!!confirmation} />
              {!confirmation ? (
                <button type="button" onClick={sendOtp} disabled={loading} className="w-full p-3.5 bg-gradient-to-r from-[#fe3d00] to-[#ff6a00] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg">Send OTP</button>
              ) : (
                <>
                  <input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className={inputClass} />
                  <button type="button" onClick={verifyOtp} disabled={loading} className="w-full p-3.5 bg-gradient-to-r from-[#fe3d00] to-[#ff6a00] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg">Verify & Login</button>
                </>
              )}
              <div id="recaptcha-container"></div>
            </>
          )}

          <button type="button" onClick={onClose} className="w-full p-3.5 mt-3 bg-white border-2 border-gray-100 text-gray-400 font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all active:scale-95">Cancel</button>

          {!isPhoneLogin && (
            <p className="text-center mt-6 text-xs font-bold text-gray-400">
              {isLogin ? "Don't have an account?" : "Already a member?"} {" "}
              <span className="text-[#fe3d00] cursor-pointer hover:underline" onClick={() => { setIsLogin(!isLogin); setIsVerifying(false); setError(""); setSuccess(""); }}>
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}