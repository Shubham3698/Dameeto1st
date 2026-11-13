import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import StickerAdmin from "../components/StickerAdmin";
import AddressModal from "../components/AddressModal"; 

const MemoryGame = () => {
  const navigate = useNavigate();
  const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://serdeptry1st.onrender.com";
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
  
  // 🔥 STATE: Check karne ke liye ki reward claim hua hai ya nahi
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  // --- LOGIN CHECK LOGIC ---
  useEffect(() => {
    if (!email) {
      setIsRedirecting(true);
      toast.error("Please login first to play! 🎮", {
        id: "login-error", duration: 3000,
        style: { border: '1px solid #fe3d00', padding: '16px', color: '#fe3d00', background: '#fff3eb' },
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
    } catch (e) { console.error("Credit fetch error:", e); }
  }, [email, API_BASE_URL]);

  // 🔥 2. NAYA FUNCTION: Check karo ki user pehle reward le chuka hai kya
  const checkRewardStatus = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer-orders/user/${email}`);
      const data = await res.json();
      if (data.success) {
        // Agar usne koi free order book kiya hoga toh uska ye status set hua tha backend me
        const alreadyClaimed = data.data.some(order => 
          order.paymentStatus === "Game Reward (Paid via 200 Coins)"
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
        const urls = data.stickers.map(s => s.url);
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
      setLoading(false); setSolved([]); setFlippedCards([]); setMoves(0); 
      setGameFinished(false); setTime(0); setGameStarted(false); setTimerActive(false); 
    }
  }, [API_BASE_URL]);

  // Component load hone par sab fetch karo
  useEffect(() => { 
    if (email) { 
      initializeGame(); 
      fetchUserCredits();
      checkRewardStatus(); 
    }
  }, [initializeGame, fetchUserCredits, checkRewardStatus, email]);

  // Stats Logic
  const accuracy = useMemo(() => moves <= 12 ? 100 : Math.max(10, Math.round((12 / moves) * 100)), [moves]);
  const calculatedCredits = useMemo(() => {
    if (!gameFinished) return 0;
    let bonus = time < 40 ? 30 : time < 60 ? 20 : time < 120 ? 10 : 0;
    return Math.round(accuracy / 2) + bonus;
  }, [gameFinished, accuracy, time]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleClick = (id) => {
    if (!gameStarted || disabled || flippedCards.includes(id) || solved.includes(id)) return;
    if (flippedCards.length === 1) {
      setMoves(m => m + 1);
      setFlippedCards(p => [...p, id]);
      setDisabled(true);
      const first = cards.find(c => c.id === flippedCards[0]);
      const second = cards.find(c => c.id === id);
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
        setTimeout(() => { setFlippedCards([]); setDisabled(false); }, 700);
      }
    } else {
      setFlippedCards([id]);
    }
  };

  const claimCredits = async () => {
    if (!email) { navigate("/account"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/game-credit`, {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credits: calculatedCredits })
      });
      const data = await res.json();
      if(data.success) {
        toast.success(`🪙 ${calculatedCredits} Credits added to your wallet!`);
        fetchUserCredits();
        setGameFinished(false);
        initializeGame();
      }
    } catch (e) { console.error(e); }
  };

  // --- REWARD CLAIMING LOGIC ---
  const TARGET_COINS = 200;
  const rewardProgress = Math.min((userCredits / TARGET_COINS) * 100, 100);
  const isRewardUnlocked = userCredits >= TARGET_COINS;

  // 🔥 Yahan ek CORS-friendly aur fast loading image set ki hai
  const spidermanStickerImg = "https://i.pinimg.com/736x/a8/15/0d/a8150d75d4442a115b0ec3679daacc7a.jpg";

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
          products: [{ 
            title: "Spiderman 6x6cm Sticker (Reward)", 
            price: 0, 
            quantity: 1, 
            image: spidermanStickerImg 
          }],
          subtotal: 0, total: 0,
          paymentStatus: "Game Reward (Paid via 200 Coins)",
          customerNote: "Claimed through Memory Game Credits"
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Reward Claimed! Check WhatsApp for details.");
        // 🔥 Instant UI update
        setHasClaimedReward(true); 

        // Redirect to WhatsApp
        let waMsg = `Hello 👋\n\nI have successfully claimed my reward! 🎉\n\n*Reward*: Spiderman 6x6cm Sticker\n*Order ID*: ${generatedId}\n\n📍 *Delivery Address*:\n${addressData.fullName}, ${addressData.city}`;
        window.location.href = `https://wa.me/917080981033?text=${encodeURIComponent(waMsg)}`;
      }
    } catch (err) {
      toast.error("Failed to claim reward. Try again!");
    } finally {
      setIsClaiming(false);
    }
  };

  const styles = {
    wrapper: { background: "#0f172a", minHeight: "100vh", width: "100%", padding: "20px 10px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: 'sans-serif' },
    header: { textAlign: 'center', marginBottom: '15px' },
    rewardBox: { background: "linear-gradient(145deg, #1e293b, #0f172a)", border: "1px solid #fe3d00", borderRadius: "12px", padding: "15px", width: "100%", maxWidth: "380px", marginBottom: "20px", textAlign: "center", boxShadow: '0 4px 15px rgba(254, 61, 0, 0.1)' },
    progressBarBg: { background: "#334155", borderRadius: "10px", height: "8px", width: "100%", overflow: "hidden", marginTop: "10px" },
    progressBarFill: { background: "#fe3d00", height: "100%", transition: "width 0.5s ease-in-out" },
    claimStickerBtn: { background: "#10b981", color: "white", padding: "12px 20px", borderRadius: "20px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', width: '100%', opacity: isClaiming ? 0.7 : 1 },
    statsRow: { display: "flex", gap: "10px", marginBottom: "20px" },
    statBox: { background: "#1e293b", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fe3d00", fontSize: "12px", minWidth: '70px', textAlign: 'center' },
    grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", width: "100%", maxWidth: "380px" },
    card: (isF, isS) => ({ aspectRatio: "1/1", cursor: "pointer", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s", transform: isF || isS ? "rotateY(180deg)" : "rotateY(0deg)" }),
    face: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
    back: { background: "#fe3d00", color: "white", fontSize: "24px", fontWeight: "bold", border: '2px solid #1e293b' },
    front: { background: "white", transform: "rotateY(180deg)", border: '2px solid #fe3d00' },
    img: { width: "100%", height: "100%", objectFit: "cover" },
    mainBtn: { background: "#fe3d00", color: "white", padding: "12px 35px", borderRadius: "25px", border: "none", fontWeight: "bold", cursor: "pointer", boxShadow: '0 4px 15px rgba(254, 61, 0, 0.3)' },
    modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#1e293b", padding: "30px", borderRadius: "20px", border: "2px solid #fe3d00", textAlign: "center", zIndex: 100, width: "90%", maxWidth: "340px", boxShadow: '0 0 50px rgba(0,0,0,0.8)' }
  };

  if (!email || isRedirecting) {
    return (
      <div style={{...styles.wrapper, justifyContent: 'center'}}>
        <div style={{color: '#fe3d00', fontSize: '18px'}}>Verifying access... 🎮</div>
      </div>
    );
  }

  if (loading) return <div style={styles.wrapper}><div style={{marginTop:'50px'}}>Loading {currentTheme} Pack...</div></div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={{color:'#fe3d00', marginBottom:'5px', fontSize:'24px', marginTop: '0'}}>Dameeto Memory</h3>
        <span style={{fontSize:'12px', color:'#94a3b8', background:'#1e293b', padding:'4px 12px', borderRadius:'10px'}}>
          Theme: <b style={{color:'#fff'}}>{currentTheme}</b>
        </span>
      </div>

      {/* --- REWARD BANNER --- */}
      <div style={styles.rewardBox}>
        {hasClaimedReward ? (
          // 🔥 AGAR REWARD LE CHUKA HAI TOH YEH DIKHEGA (WITH IMAGE)
          <>
            <div style={{color: '#10b981', fontWeight: 'bold', fontSize: '16px'}}>🎉 Reward Claimed!</div>
            
            {/* Added Image here */}
            <div style={{ margin: "10px auto", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "2px solid #10b981", backgroundColor: "white" }}>
              <img 
                src={spidermanStickerImg} 
                alt="Spiderman Sticker" 
                style={{ width: "100%", height: "100%", objectFit: "contain" }} 
              />
            </div>
            
            <div style={{fontSize: '12px', color: '#cbd5e1', marginTop: '5px'}}>
              You've successfully claimed your free Spiderman sticker. Keep playing for fun! 🎮
            </div>
            <div style={{fontSize: '11px', textAlign: 'center', marginTop: '10px', color: '#94a3b8'}}>
              Your Wallet: <span style={{color: '#fe3d00', fontWeight: 'bold'}}>{userCredits} 🪙</span>
            </div>
          </>
        ) : isRewardUnlocked ? (
          // AGAR 200 COINS HO GAYE AUR CLAIM NAHI KIYA TOH YEH DIKHEGA
          <>
            <div style={{color: '#10b981', fontWeight: 'bold', fontSize: '16px'}}>🎉 Target Reached!</div>
            
             {/* Unclaimed lekin ready pe bhi Image dikhate hain */}
            <div style={{ margin: "10px auto", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "2px dashed #10b981", backgroundColor: "white" }}>
              <img 
                src={spidermanStickerImg} 
                alt="Spiderman Sticker" 
                style={{ width: "100%", height: "100%", objectFit: "contain" }} 
              />
            </div>

            <div style={{fontSize: '12px', color: '#cbd5e1', marginTop: '5px'}}>
              Your FREE 6x6cm Spiderman sticker is ready for doorstep delivery! 🕷️
            </div>
            <button onClick={handleClaimPhysicalStickerClick} disabled={isClaiming} style={styles.claimStickerBtn}>
              {isClaiming ? "Processing..." : "Claim Home Delivery Now"}
            </button>
          </>
        ) : (
          // AGAR TARGET COMPLETE NAHI HUA TOH YEH DIKHEGA
          <>
            <div style={{fontSize: '13px', color: '#f8fafc', marginBottom: '8px'}}>
              🕷️ Reach <b>200 🪙</b> for a FREE 6x6cm Spiderman Sticker delivered to your doorstep!
            </div>
            <div style={styles.progressBarBg}>
              <div style={{...styles.progressBarFill, width: `${rewardProgress}%`}}></div>
            </div>
            <div style={{fontSize: '11px', textAlign: 'right', marginTop: '6px', color: '#94a3b8'}}>
              <span style={{color: '#fe3d00', fontWeight: 'bold'}}>{userCredits}</span> / 200 🪙
            </div>
          </>
        )}
      </div>
      {/* ------------------------- */}
      
      <div style={styles.statsRow}>
        <div style={styles.statBox}>Moves<br/>{moves}</div>
        <div style={styles.statBox}>Acc<br/>{accuracy}%</div>
        <div style={styles.statBox}>Time<br/>{time}s</div>
        <div style={styles.statBox}>My Wallet<br/>🪙 {userCredits}</div>
      </div>
      
      <div style={styles.grid}>
        {cards.map(card => (
          <div key={card.id} style={{perspective:"1000px"}} onClick={() => handleClick(card.id)}>
            <div style={styles.card(flippedCards.includes(card.id), solved.includes(card.id))}>
              <div style={{...styles.face, ...styles.back}}>?</div>
              <div style={{...styles.face, ...styles.front}}>
                <img src={card.imgUrl} style={styles.img} alt="st" loading="lazy" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{marginTop:'30px', display:'flex', flexDirection:'column', gap:'12px', alignItems:'center'}}>
        {!gameStarted ? (
          <button onClick={() => {setGameStarted(true); setTimerActive(true);}} style={styles.mainBtn}>
            START GAME
          </button>
        ) : (
          <button onClick={initializeGame} style={{color:'#64748b', fontSize:'13px', background:'none', border:'1px solid #334155', padding:'5px 15px', borderRadius:'15px', cursor:'pointer'}}>
            🔄 New Group / Restart
          </button>
        )}
        
        {isAdmin && (
          <button onClick={()=>setShowAdmin(true)} style={{color:'#475569', fontSize:'10px', border:'1px dashed #334155', padding:'5px 10px', borderRadius:'5px', cursor:'pointer', marginTop:'10px'}}>
            ⚙️ Manage Sticker Groups
          </button>
        )}
      </div>

      {showAdmin && <StickerAdmin onClose={()=>setShowAdmin(false)} API_BASE_URL={API_BASE_URL} />}
      <AddressModal show={showAddressModal} handleClose={() => setShowAddressModal(false)} handleSave={handleAddressSaveForReward} />

      {gameFinished && (
        <div style={styles.modal}>
          <div style={{fontSize:'50px', marginBottom:'10px'}}>🏆</div>
          <h2 style={{color: "#fe3d00", margin:'0'}}>Victory!</h2>
          <p style={{color:'#94a3b8'}}>{currentTheme} Pack Cleared</p>
          <hr style={{borderColor:'#334155', margin:'15px 0'}} />
          <div style={{marginBottom:'20px'}}>
             <p style={{margin:'5px 0'}}>Accuracy: <b>{accuracy}%</b></p>
             <p style={{margin:'5px 0'}}>Time: <b>{time}s</b></p>
             <h3 style={{margin: "15px 0", color:'#fff'}}>You Won: <span style={{color:'#fe3d00'}}>🪙 {calculatedCredits}</span></h3>
          </div>
          <button onClick={claimCredits} style={styles.mainBtn}>CLAIM & SAVE</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;