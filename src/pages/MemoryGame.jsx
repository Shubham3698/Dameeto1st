import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import StickerAdmin from "../components/StickerAdmin";
import AddressModal from "../components/AddressModal";

const MemoryGame = () => {
  const navigate = useNavigate();
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://serdeptry1st.onrender.com";
  const email = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName") || "Gamer";
  const isAdmin = email === "pandey0shubham3698@gmail.com";

  // States
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  // Redeem Code States
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  // --- LOGIN CHECK LOGIC ---
  useEffect(() => {
    if (!email) {
      setIsRedirecting(true);
      toast.error("Please login first to play! 🎮", {
        id: "login-error",
        duration: 3000,
        style: {
          border: "1px solid #fe3d00",
          padding: "16px",
          color: "#fe3d00",
          background: "#fff3eb",
        },
      });
      const timer = setTimeout(() => navigate("/account"), 2000);
      return () => clearTimeout(timer);
    }
  }, [email, navigate]);

  // 1. Fetch User Current Credits
  const fetchUserCredits = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-credits/${email}`);
      const data = await res.json();
      if (data.success) setUserCredits(data.credits);
    } catch (e) {
      console.error("Credit fetch error:", e);
    }
  }, [email, API_BASE_URL]);

  // 2. Check Reward Status
  const checkRewardStatus = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/user/${email}`);
      const data = await res.json();
      if (data.success) {
        const alreadyClaimed = data.data.some(
          (order) => order.paymentStatus === "Game Reward (Paid via 1000 Coins)"
        );
        setHasClaimedReward(alreadyClaimed);
      }
    } catch (error) {
      console.error("Error checking reward status:", error);
    }
  }, [email, API_BASE_URL]);

  // 3. Initialize Game
  const initializeGame = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-stickers`);
      const data = await res.json();

      if (data.success && data.stickers.length > 0) {
        setCurrentTheme(data.categoryName || "Dameeto Special");
        const urls = data.stickers.map((s) => s.url);
        const generated = [...urls, ...urls]
          .sort(() => Math.random() - 0.5)
          .map((imgUrl, index) => ({ id: index, imgUrl }));
        setCards(generated);
      } else {
        toast.error("No stickers found! Please upload from Admin.");
      }
    } catch (e) {
      console.error("Game init error:", e);
      toast.error("Backend connection failed!");
    } finally {
      setLoading(false);
      setSolved([]);
      setFlippedCards([]);
      setMoves(0);
      setGameFinished(false);
      setTime(0);
      setGameStarted(false);
      setTimerActive(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (email) {
      initializeGame();
      fetchUserCredits();
      checkRewardStatus();
    }
  }, [initializeGame, fetchUserCredits, checkRewardStatus, email]);

  // Stats Logic
  const accuracy = useMemo(
    () => (moves <= 12 ? 100 : Math.max(10, Math.round((12 / moves) * 100))),
    [moves]
  );

  const calculatedCredits = useMemo(() => {
    if (!gameFinished) return 0;
    let bonus = time < 40 ? 30 : time < 60 ? 20 : time < 120 ? 10 : 0;
    return Math.round(accuracy / 2) + bonus;
  }, [gameFinished, accuracy, time]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleClick = (id) => {
    if (!gameStarted || disabled || flippedCards.includes(id) || solved.includes(id)) return;
    if (flippedCards.length === 1) {
      setMoves((m) => m + 1);
      setFlippedCards((p) => [...p, id]);
      setDisabled(true);
      const first = cards.find((c) => c.id === flippedCards[0]);
      const second = cards.find((c) => c.id === id);
      if (first.imgUrl === second.imgUrl) {
        const newSolved = [...solved, flippedCards[0], id];
        setSolved(newSolved);
        setFlippedCards([]);
        setDisabled(false);
        if (newSolved.length === cards.length) {
          setGameFinished(true);
          setTimerActive(false);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 700);
      }
    } else {
      setFlippedCards([id]);
    }
  };

  const claimCredits = async () => {
    if (!email) {
      navigate("/account");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/game-credit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, credits: calculatedCredits }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`🪙 ${calculatedCredits} Credits added to your wallet!`);
        fetchUserCredits();
        setGameFinished(false);
        initializeGame();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Redeem Code Handler
  const handleRedeemCode = async (e) => {
    e.preventDefault();
    if (!redeemCode.trim()) return toast.error("Please enter a code!");

    setIsRedeeming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/redeem-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: redeemCode }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setRedeemCode("");
        fetchUserCredits();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsRedeeming(false);
    }
  };

  // --- REWARD CLAIMING LOGIC ---
  const TARGET_COINS = 1000;
  const rewardProgress = Math.min((userCredits / TARGET_COINS) * 100, 100);
  const isRewardUnlocked = userCredits >= TARGET_COINS;

  const spidermanStickerImg =
    "https://i.pinimg.com/736x/a8/15/0d/a8150d75d4442a115b0ec3679daacc7a.jpg";

  const handleClaimPhysicalStickerClick = () => {
    if (hasClaimedReward) return;
    setShowAddressModal(true);
  };

  const handleAddressSaveForReward = async (addressData) => {
    setShowAddressModal(false);
    setIsClaiming(true);
    const generatedId = "RWD" + Date.now().toString().slice(-5);

    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortOrderId: generatedId,
          userName: userName,
          userEmail: email,
          address: addressData,
          products: [
            {
              title: "Spiderman 6x6cm Sticker (Reward)",
              price: 0,
              quantity: 1,
              image: spidermanStickerImg,
            },
          ],
          subtotal: 0,
          total: 0,
          paymentStatus: "Game Reward (Paid via 1000 Coins)",
          customerNote: "Claimed through Memory Game Credits",
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Reward Claimed! Check WhatsApp for details.");
        setHasClaimedReward(true);

        let waMsg = `Hello 👋\n\nI have successfully claimed my reward! 🎉\n\n*Reward*: Spiderman 6x6cm Sticker\n*Order ID*: ${generatedId}\n\n📍 *Delivery Address*:\n${addressData.fullName}, ${addressData.city}`;
        window.location.href = `https://wa.me/917080981033?text=${encodeURIComponent(waMsg)}`;
      }
    } catch (err) {
      toast.error("Failed to claim reward. Try again!");
    } finally {
      setIsClaiming(false);
    }
  };

  if (!email || isRedirecting) {
    return (
      <div className="mg-wrapper mg-center">
        <div style={{ color: "#fe3d00", fontSize: "18px", fontWeight: "bold" }}>
          Verifying access... 🎮
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mg-wrapper mg-center">
        <div style={{ color: "#cbd5e1", fontSize: "16px" }}>
          Loading {currentTheme} Pack...
        </div>
      </div>
    );
  }

  return (
    <div className="mg-wrapper">
      {/* 🔥 RESPONSIVE STYLES (Mobile + Desktop) */}
      <style>{`
        .mg-wrapper {
          background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 60%);
          min-height: 100vh;
          width: 100%;
          padding: 20px 14px 40px;
          color: #f8fafc;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }
        .mg-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mg-container {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .mg-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mg-header {
          text-align: center;
        }
        .mg-title {
          color: #fe3d00;
          margin: 0 0 6px 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .mg-theme-badge {
          display: inline-block;
          font-size: 12px;
          color: #94a3b8;
          background: rgba(30, 41, 59, 0.85);
          border: 1px solid #334155;
          padding: 4px 12px;
          border-radius: 999px;
        }
        .mg-reward-box {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(254, 61, 0, 0.45);
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }
        .mg-sticker-preview {
          margin: 0 auto 10px auto;
          width: 68px;
          height: 68px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #fe3d00;
          background: #fff;
        }
        .mg-progress-bg {
          background: #334155;
          border-radius: 999px;
          height: 8px;
          width: 100%;
          overflow: hidden;
          margin-top: 10px;
        }
        .mg-progress-fill {
          background: linear-gradient(90deg, #fe3d00, #ff7b00);
          height: 100%;
          transition: width 0.5s ease-in-out;
        }
        .mg-redeem-form {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .mg-redeem-input {
          flex: 1;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #0f172a;
          color: white;
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .mg-redeem-input:focus {
          border-color: #fe3d00;
        }
        .mg-redeem-btn {
          background: #fe3d00;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.2s;
        }
        .mg-redeem-btn:hover {
          opacity: 0.92;
        }
        .mg-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .mg-stat-box {
          background: rgba(30, 41, 59, 0.8);
          padding: 10px 6px;
          border-radius: 12px;
          border: 1px solid rgba(254, 61, 0, 0.35);
          text-align: center;
        }
        .mg-stat-label {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 3px;
        }
        .mg-stat-val {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .mg-board-panel {
          background: rgba(30, 41, 59, 0.45);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 18px;
          padding: 14px;
        }
        .mg-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          width: 100%;
        }
        .mg-card-wrap {
          perspective: 1000px;
          cursor: pointer;
        }
        .mg-card {
          aspect-ratio: 1 / 1;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mg-card.flipped {
          transform: rotateY(180deg);
        }
        .mg-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .mg-back {
          background: linear-gradient(135deg, #fe3d00, #d93200);
          color: white;
          font-size: 22px;
          font-weight: 800;
          border: 2px solid #1e293b;
          box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.2);
        }
        .mg-front {
          background: #ffffff;
          transform: rotateY(180deg);
          border: 2px solid #fe3d00;
        }
        .mg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .mg-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          margin-top: 4px;
        }
        .mg-main-btn {
          background: linear-gradient(90deg, #fe3d00, #ff5e2b);
          color: white;
          padding: 13px 36px;
          border-radius: 999px;
          border: none;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.5px;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 6px 20px rgba(254, 61, 0, 0.35);
          transition: transform 0.15s;
        }
        .mg-main-btn:active {
          transform: scale(0.98);
        }
        .mg-claim-btn {
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .mg-restart-btn {
          color: #cbd5e1;
          font-size: 13px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid #334155;
          padding: 10px 20px;
          border-radius: 999px;
          cursor: pointer;
          width: 100%;
          transition: border-color 0.2s;
        }
        .mg-restart-btn:hover {
          border-color: #fe3d00;
        }
        .mg-admin-btn {
          color: #94a3b8;
          font-size: 11px;
          background: transparent;
          border: 1px dashed #334155;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .mg-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
        }
        .mg-modal {
          background: #1e293b;
          padding: 28px;
          border-radius: 20px;
          border: 2px solid #fe3d00;
          text-align: center;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }

        /* 💻 DESKTOP / LAPTOP LAYOUT (900px and above) */
        @media (min-width: 900px) {
          .mg-wrapper {
            padding: 36px 28px;
            display: flex;
            align-items: center;
          }
          .mg-container {
            max-width: 1080px;
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 28px;
            align-items: start;
          }
          .mg-sidebar {
            position: sticky;
            top: 24px;
          }
          .mg-header {
            text-align: left;
          }
          .mg-title {
            font-size: 30px;
          }
          .mg-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .mg-stat-box {
            padding: 12px;
          }
          .mg-stat-val {
            font-size: 16px;
          }
          .mg-board-panel {
            padding: 22px;
            border-radius: 22px;
          }
          .mg-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
          }
          .mg-back {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="mg-container">
        {/* LEFT SIDEBAR (Desktop) / TOP SECTION (Mobile) */}
        <div className="mg-sidebar">
          <div className="mg-header">
            <h3 className="mg-title">Dameeto Memory</h3>
            <span className="mg-theme-badge">
              Theme: <b style={{ color: "#fff" }}>{currentTheme}</b>
            </span>
          </div>

          {/* REWARD BANNER */}
          <div className="mg-reward-box">
            <div className="mg-sticker-preview">
              <img
                src={spidermanStickerImg}
                alt="Spiderman Sticker"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {hasClaimedReward ? (
              <>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "16px" }}>
                  🎉 Reward Claimed!
                </div>
                <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "5px" }}>
                  You've successfully claimed your free Spiderman sticker. Keep playing for fun! 🎮
                </div>
                <div style={{ fontSize: "12px", marginTop: "10px", color: "#94a3b8" }}>
                  Your Wallet: <span style={{ color: "#fe3d00", fontWeight: "bold" }}>{userCredits} 🪙</span>
                </div>
              </>
            ) : isRewardUnlocked ? (
              <>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "16px" }}>
                  🎉 Target Reached!
                </div>
                <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "5px" }}>
                  Your FREE 6x6cm Spiderman sticker is ready for doorstep delivery! 🕷️
                </div>
                <button
                  onClick={handleClaimPhysicalStickerClick}
                  disabled={isClaiming}
                  className="mg-claim-btn"
                  style={{ opacity: isClaiming ? 0.7 : 1 }}
                >
                  {isClaiming ? "Processing..." : "Claim Home Delivery Now"}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "13px", color: "#f8fafc", lineHeight: "1.4" }}>
                  🕷️ Reach <b>1000 🪙</b> for a FREE 6x6cm Spiderman Sticker delivered to your doorstep!
                </div>
                <div className="mg-progress-bg">
                  <div className="mg-progress-fill" style={{ width: `${rewardProgress}%` }} />
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", marginTop: "6px", color: "#94a3b8" }}>
                  <span style={{ color: "#fe3d00", fontWeight: "bold" }}>{userCredits}</span> / 1000 🪙
                </div>

                {/* REDEEM CODE FORM */}
                <form onSubmit={handleRedeemCode} className="mg-redeem-form">
                  <input
                    type="text"
                    placeholder="Have a redeem code?"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="mg-redeem-input"
                  />
                  <button
                    type="submit"
                    disabled={isRedeeming}
                    className="mg-redeem-btn"
                    style={{ opacity: isRedeeming ? 0.6 : 1 }}
                  >
                    {isRedeeming ? "..." : "Apply"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* STATS */}
          <div className="mg-stats-grid">
            <div className="mg-stat-box">
              <div className="mg-stat-label">Moves</div>
              <div className="mg-stat-val">{moves}</div>
            </div>
            <div className="mg-stat-box">
              <div className="mg-stat-label">Acc</div>
              <div className="mg-stat-val">{accuracy}%</div>
            </div>
            <div className="mg-stat-box">
              <div className="mg-stat-label">Time</div>
              <div className="mg-stat-val">{time}s</div>
            </div>
            <div className="mg-stat-box">
              <div className="mg-stat-label">Wallet</div>
              <div className="mg-stat-val" style={{ color: "#fe3d00" }}>
                🪙 {userCredits}
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="mg-controls">
            {!gameStarted ? (
              <button
                onClick={() => {
                  setGameStarted(true);
                  setTimerActive(true);
                }}
                className="mg-main-btn"
              >
                START GAME
              </button>
            ) : (
              <button onClick={initializeGame} className="mg-restart-btn">
                🔄 New Group / Restart
              </button>
            )}

            {isAdmin && (
              <button onClick={() => setShowAdmin(true)} className="mg-admin-btn">
                ⚙️ Manage Sticker Groups
              </button>
            )}
          </div>
        </div>

        {/* RIGHT GAME BOARD (Desktop) / BOTTOM BOARD (Mobile) */}
        <div className="mg-board-panel">
          <div className="mg-grid">
            {cards.map((card) => {
              const isFlipped = flippedCards.includes(card.id) || solved.includes(card.id);
              return (
                <div
                  key={card.id}
                  className="mg-card-wrap"
                  onClick={() => handleClick(card.id)}
                >
                  <div className={`mg-card ${isFlipped ? "flipped" : ""}`}>
                    <div className="mg-face mg-back">?</div>
                    <div className="mg-face mg-front">
                      <img src={card.imgUrl} className="mg-img" alt="sticker" loading="lazy" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAdmin && <StickerAdmin onClose={() => setShowAdmin(false)} API_BASE_URL={API_BASE_URL} />}
      <AddressModal
        show={showAddressModal}
        handleClose={() => setShowAddressModal(false)}
        handleSave={handleAddressSaveForReward}
      />

      {gameFinished && (
        <div className="mg-modal-overlay">
          <div className="mg-modal">
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>🏆</div>
            <h2 style={{ color: "#fe3d00", margin: "0" }}>Victory!</h2>
            <p style={{ color: "#94a3b8", marginTop: "4px" }}>{currentTheme} Pack Cleared</p>
            <hr style={{ borderColor: "#334155", margin: "15px 0" }} />
            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "5px 0" }}>
                Accuracy: <b>{accuracy}%</b>
              </p>
              <p style={{ margin: "5px 0" }}>
                Time: <b>{time}s</b>
              </p>
              <h3 style={{ margin: "15px 0", color: "#fff" }}>
                You Won: <span style={{ color: "#fe3d00" }}>🪙 {calculatedCredits}</span>
              </h3>
            </div>
            <button onClick={claimCredits} className="mg-main-btn">
              CLAIM & SAVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;