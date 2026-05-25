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
  // --- Standard View Toggle States ---
  const [isLogin, setIsLogin] = useState(true); // Default matching professional portals
  const [isPhoneLogin, setIsPhoneLogin] = useState(true); // Default modern mobile access
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // --- Conditional Flow Check for Mobile Signup ---
  const [isNewUser, setIsNewUser] = useState(false); 

  // --- Form Input Fields ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // --- Notification Responses ---
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  // --- Auth State Monitoring & Resource Disposal ---
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

  // --- Social Auth Sync Handlers ---
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true); 
      setError(""); 
      setSuccess("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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
    if (!email) { 
      setError("Please enter your email address first."); 
      return; 
    }
    try {
      setLoading(true);
      setError("");
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset token dispatched to inbox!");
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- Classical Email Credentials Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 
    setLoading(true);
    
    try {
      let userCredential;
      if (!isLogin) {
        if (!name.trim()) throw new Error("Please fill out your Full Name.");
        if (password !== confirmPassword) throw new Error("Passwords match nahi ho rahe!");
        
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        
        await fetch(`${API_BASE_URL}/api/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, firebaseUid: userCredential.user.uid }),
        });
        setSuccess("Verification email sent! Redirecting...");
        setIsVerifying(true);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) { 
          setError("Pehle email verify karein."); 
          return; 
        }
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
        }
      }
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- Modernized Mobile OTP Logic Flow ---
  const sendOtp = async () => {
    try {
      setLoading(true); 
      setError(""); 
      setSuccess("");

      if (!phone || phone.trim().length < 10) {
        setError("Bhai, please ek valid mobile number input karo.");
        setLoading(false);
        return;
      }

      const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : "+91" + phone.trim();

      // Step 1: Pre-check DB user registration status to streamline UI layout
      try {
        const checkUserRes = await fetch(`${API_BASE_URL}/api/users/check-phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formattedPhone })
        });
        if (checkUserRes.ok) {
          const checkUserData = await checkUserRes.json();
          // User registration state directly changes context rendering
          setIsNewUser(!checkUserData.exists);
        }
      } catch (dbErr) {
        console.warn("User status pre-check unreachable, falling back to dynamic initialization", dbErr);
      }

      // Step 2: Trigger reCAPTCHA and process transaction
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA background layer resolved successfully.")
      });

      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmation(result);
      setSuccess("OTP security code successfully transmitted!");
    } catch (err) { 
      console.error(err);
      if (err.code === 'auth/too-many-requests') {
        setError("Bhai, bahut baar try kar liya! Google ne thodi der ke liye block kiya hai. 1 ghante baad try karo.");
      } else {
        setError(err.message);
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally { 
      setLoading(false); 
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true); 
      setError("");

      if (!otp || otp.trim().length < 6) {
        setError("Bhai, valid 6-digit security OTP provide karo.");
        setLoading(false);
        return;
      }

      // User validation guard clause
      if (isNewUser && !name.trim()) {
        setError("Pehle apna naam toh batao bhai! Complete credentials are required.");
        setLoading(false);
        return;
      }

      const result = await confirmation.confirm(otp.trim());
      const phoneEmail = result.user.phoneNumber + "@phone.com";

      // Dispatch payloads to DB backend pipeline
      await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: isNewUser ? name.trim() : "Phone User", 
          email: phoneEmail, 
          password: "phone_login_no_password", 
          firebaseUid: result.user.uid,
          phone: result.user.phoneNumber
        }),
      });

      const loginRes = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: phoneEmail }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem("userEmail", loginData.email);
        localStorage.setItem("userName", loginData.name);
        window.location.href = "/account";
      } else {
        throw new Error(loginData.message || "Database state synchronization failure.");
      }
    } catch (err) { 
      setError("Invalid OTP configuration or server pipeline sync dropped."); 
    } finally { 
      setLoading(false); 
    }
  };

  const inputClass = "w-full p-3.5 mb-3 rounded-2xl border border-slate-200/80 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all bg-slate-50/50 font-medium text-slate-800 placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[9999] backdrop-blur-[6px] p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[420px] p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(15,23,42,0.15)] overflow-y-auto max-h-[95vh] border border-slate-100 flex flex-col justify-between">
        
        <div>
          {/* Top Decorative Node & Header */}
          <div className="text-center mb-6">
            <div className="h-12 w-12 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-md shadow-orange-500/20 mx-auto mb-3">
              ⚡
            </div>
            <h2 className="font-extrabold text-2xl text-slate-800 tracking-tight">
              {isPhoneLogin ? "Secure Access" : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              {isPhoneLogin ? "Instant OTP Validation" : "Cloud Credentials Node"}
            </p>
          </div>

          {/* Toast / Notification Arrays */}
          {error && (
            <p className="text-red-600 text-xs mb-4 text-center bg-red-50/80 p-3.5 rounded-xl border border-red-100/70 font-semibold leading-snug animate-in shake duration-300">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-600 text-xs mb-4 text-center bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-100/70 font-semibold leading-snug">
              {success}
            </p>
          )}

          {/* Interface Segment Controllers */}
          <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-6 border border-slate-200/20">
            <button 
              type="button" 
              onClick={() => { setIsPhoneLogin(true); setError(""); setSuccess(""); }} 
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${isPhoneLogin ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Phone Login
            </button>
            <button 
              type="button" 
              onClick={() => { setIsPhoneLogin(false); setError(""); setSuccess(""); }} 
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${!isPhoneLogin ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Email Setup
            </button>
          </div>

          {/* Social Access Vectors */}
          {!isPhoneLogin && !isVerifying && (
            <div className="mb-4">
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                disabled={loading}
                className="w-full p-3.5 flex items-center justify-center gap-3 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G Auth Connector" className="w-4 h-4" />
                Continue with Google
              </button>
              <div className="relative flex items-center justify-center my-5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <span className="relative bg-white px-3 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Or Secure Via Native</span>
              </div>
            </div>
          )}

          {/* Main Transaction Form Blocks */}
          <div className="space-y-1">
            {!isPhoneLogin ? (
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <input 
                    type="text"
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className={inputClass} 
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={inputClass} 
                />
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Account Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={inputClass} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-3.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {!isLogin && (
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={inputClass} 
                  />
                )}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full p-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-orange-600 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? "Processing Secure State..." : isLogin ? "Authorize Security Session" : "Provision New Account"}
                </button>
                {isLogin && (
                  <p 
                    className="text-center text-slate-400 text-[10px] font-bold uppercase mt-4 cursor-pointer hover:text-orange-500 transition-colors tracking-wider" 
                    onClick={handleForgotPassword}
                  >
                    Forgot System Password?
                  </p>
                )}
              </form>
            ) : (
              <div className="space-y-1">
                {/* Mobile Identity Block */}
                <div className="relative flex items-center">
                  <input 
                    type="tel"
                    placeholder="Phone Number (e.g. 9876543210)" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className={`${inputClass} pl-14`}
                    disabled={!!confirmation} 
                  />
                  <span className="absolute left-4 top-[15px] text-slate-400 text-sm font-bold border-r border-slate-200 pr-2">
                    +91
                  </span>
                </div>

                {!confirmation ? (
                  <button 
                    type="button" 
                    onClick={sendOtp} 
                    disabled={loading} 
                    className="w-full p-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {loading ? "Requesting OTP..." : "Generate Security OTP"}
                  </button>
                ) : (
                  <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                    
                    {/* NEW USER INTERFACE ADAPTATION GATE */}
                    {isNewUser && (
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/60 mb-2">
                        <label className="text-[10px] font-black text-orange-600 uppercase tracking-wider block mb-2">
                          🌟 Account Node Not Found. Please Input Profile Details:
                        </label>
                        <input 
                          type="text"
                          placeholder="Your Full Name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className={`${inputClass} mb-0 bg-white border-slate-200 focus:border-orange-500`}
                        />
                      </div>
                    )}

                    <input 
                      type="text"
                      placeholder="Input 6-Digit Validation OTP" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      className={inputClass} 
                      maxLength={6}
                    />
                    <button 
                      type="button" 
                      onClick={verifyOtp} 
                      disabled={loading} 
                      className="w-full p-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50"
                    >
                      {loading ? "Validating Tokens..." : "Verify OTP & Secure Account"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setConfirmation(null); setOtp(""); }} 
                      className="w-full text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider pt-2 hover:text-slate-600 transition-colors"
                    >
                      Change Number
                    </button>
                  </div>
                )}
                {/* Captcha Sandbox Node */}
                <div id="recaptcha-container" className="mt-4 flex justify-center overflow-hidden rounded-xl scale-90 origin-center"></div>
              </div>
            )}
          </div>
        </div>

        {/* Universal Footer Interfaces */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          {!isPhoneLogin && (
            <p className="text-center mb-4 text-xs font-semibold text-slate-400">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <span 
                className="text-orange-500 font-bold cursor-pointer hover:underline transition-all ml-1" 
                onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          )}
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full p-3.5 bg-slate-50 border border-slate-200/60 text-slate-400 font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            Cancel Actions
          </button>
        </div>

      </div>
    </div>
  );
}