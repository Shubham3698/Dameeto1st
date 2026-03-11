import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StickerAdmin from "../components/StickerAdmin"; 

const MemoryGame = () => {
  const navigate = useNavigate();
  const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://serdeptry1st.onrender.com";
  const email = localStorage.getItem("userEmail");
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

  // 1. Fetch User Current Credits (Fixing the 404 issue)
  const fetchUserCredits = useCallback(async () => {
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-credits/${email}`);
      const data = await res.json();
      if (data.success) setUserCredits(data.credits);
    } catch (e) { console.error("Credit fetch error:", e); }
  }, [email, API_BASE_URL]);

  // 2. Initialize Game with Random Group
  const initializeGame = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-stickers`);
      const data = await res.json();
      
      if (data.success && data.stickers.length > 0) {
        setCurrentTheme(data.categoryName || "Dameeto Special");
        const urls = data.stickers.map(s => s.url);
        
        // 12 stickers ko double karke 24 cards banana aur shuffle karna
        const generated = [...urls, ...urls]
          .sort(() => Math.random() - 0.5)
          .map((imgUrl, index) => ({ id: index, imgUrl }));
        
        setCards(generated);
      } else {
        alert("No stickers found! Please upload from Admin.");
      }
    } catch (e) { 
      console.error("Game init error:", e);
      alert("Backend connection failed!");
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
    initializeGame(); 
    fetchUserCredits();
  }, [initializeGame, fetchUserCredits]);

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
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credits: calculatedCredits })
      });
      const data = await res.json();
      if(data.success) navigate("/account");
    } catch (e) { console.error(e); }
  };

  const styles = {
    wrapper: { background: "#0f172a", minHeight: "100vh", width: "100%", padding: "20px 10px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: 'sans-serif' },
    header: { textAlign: 'center', marginBottom: '20px' },
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

  if (loading) return <div style={styles.wrapper}><div style={{marginTop:'50px'}}>Loading {currentTheme} Pack...</div></div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={{color:'#fe3d00', marginBottom:'5px', fontSize:'24px'}}>Dameeto Memory</h3>
        <span style={{fontSize:'12px', color:'#94a3b8', background:'#1e293b', padding:'4px 12px', borderRadius:'10px'}}>
          Theme: <b style={{color:'#fff'}}>{currentTheme}</b>
        </span>
      </div>
      
      <div style={styles.statsRow}>
        <div style={styles.statBox}>Moves<br/>{moves}</div>
        <div style={styles.statBox}>Acc<br/>{accuracy}%</div>
        <div style={styles.statBox}>Time<br/>{time}s</div>
        <div style={styles.statBox}>My Wallet<br/>🪙{userCredits}</div>
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