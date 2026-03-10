import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StickerAdmin from "../components/StickerAdmin"; 

const MemoryGame = () => {
  const navigate = useNavigate();
  const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://serdeptry1st.onrender.com";
  const email = localStorage.getItem("userEmail");
  const isAdmin = email === "pandey0shubham3698@gmail.com";

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

  const initializeGame = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-stickers`);
      const data = await res.json();
      if (data.success && data.stickers.length > 0) {
        const urls = data.stickers.map(s => s.url);
        const generated = [...urls, ...urls].sort(() => Math.random() - 0.5).map((imgUrl, index) => ({ id: index, imgUrl }));
        setCards(generated);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setSolved([]); setFlippedCards([]); setMoves(0); setGameFinished(false); setTime(0); setGameStarted(false); setTimerActive(false); }
  }, [API_BASE_URL]);

  useEffect(() => { initializeGame(); }, [initializeGame]);

  const accuracy = useMemo(() => moves <= 12 ? 100 : Math.max(10, Math.round((12 / moves) * 100)), [moves]);
  const credits = useMemo(() => {
    if (!gameFinished) return 0;
    let bonus = time < 40 ? 30 : time < 60 ? 20 : time < 120 ? 10 : 0;
    return Math.round(accuracy / 2) + bonus;
  }, [gameFinished, accuracy, time]);

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleClick = (id) => {
    if (!gameStarted || disabled || flippedCards.includes(id) || solved.includes(id)) return;
    if (flippedCards.length === 1) {
      setMoves(m => m + 1); setFlippedCards(p => [...p, id]); setDisabled(true);
      const first = cards.find(c => c.id === flippedCards[0]);
      const second = cards.find(c => c.id === id);
      if (first.imgUrl === second.imgUrl) {
        const newSolved = [...solved, flippedCards[0], id];
        setSolved(newSolved); setFlippedCards([]); setDisabled(false);
        if (newSolved.length === cards.length) { setGameFinished(true); setTimerActive(false); }
      } else { setTimeout(() => { setFlippedCards([]); setDisabled(false); }, 700); }
    } else { setFlippedCards([id]); }
  };

  const claimCredits = async () => {
    if (!email) { navigate("/account"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/game-credit`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credits })
      });
      const data = await res.json();
      if(data.success) navigate("/account");
    } catch (e) { console.error(e); }
  };

  const styles = {
    wrapper: { background: "#0f172a", minHeight: "100vh", width: "100%", padding: "20px 10px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: 'sans-serif' },
    statsRow: { display: "flex", gap: "10px", marginBottom: "20px" },
    statBox: { background: "#1e293b", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fe3d00", fontSize: "12px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", width: "100%", maxWidth: "380px" },
    card: (isF, isS) => ({ aspectRatio: "1/1", cursor: "pointer", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s", transform: isF || isS ? "rotateY(180deg)" : "rotateY(0deg)" }),
    face: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
    back: { background: "#fe3d00", color: "white", fontSize: "20px", fontWeight: "bold" },
    front: { background: "white", transform: "rotateY(180deg)" },
    img: { width: "100%", height: "100%", objectFit: "cover" },
    mainBtn: { background: "#fe3d00", color: "white", padding: "12px 35px", borderRadius: "25px", border: "none", fontWeight: "bold", cursor: "pointer" },
    modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#1e293b", padding: "30px", borderRadius: "20px", border: "2px solid #fe3d00", textAlign: "center", zIndex: 100, width: "90%", maxWidth: "340px" }
  };

  if (loading) return <div style={styles.wrapper}>Loading...</div>;

  return (
    <div style={styles.wrapper}>
      <h3 style={{color:'#fe3d00', marginBottom:'15px'}}>Dameeto Memory</h3>
      <div style={styles.statsRow}>
        <div style={styles.statBox}>Moves: {moves}</div>
        <div style={styles.statBox}>Acc: {accuracy}%</div>
        <div style={styles.statBox}>Time: {time}s</div>
      </div>
      <div style={styles.grid}>
        {cards.map(card => (
          <div key={card.id} style={{perspective:"1000px"}} onClick={() => handleClick(card.id)}>
            <div style={styles.card(flippedCards.includes(card.id), solved.includes(card.id))}>
              <div style={{...styles.face, ...styles.back}}>?</div>
              <div style={{...styles.face, ...styles.front}}><img src={card.imgUrl} style={styles.img} alt="st" /></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:'30px', display:'flex', flexDirection:'column', gap:'10px'}}>
        {!gameStarted ? <button onClick={() => setGameStarted(true)||setTimerActive(true)} style={styles.mainBtn}>START GAME</button> 
        : <button onClick={initializeGame} style={{color:'#64748b', fontSize:'12px', background:'none', border:'none', cursor:'pointer'}}>Restart</button>}
        {isAdmin && <button onClick={()=>setShowAdmin(true)} style={{color:'#475569', fontSize:'10px', border:'1px dashed #334155', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>⚙️ Admin</button>}
      </div>
      {showAdmin && <StickerAdmin onClose={()=>setShowAdmin(false)} API_BASE_URL={API_BASE_URL} />}
      {gameFinished && (
        <div style={styles.modal}>
          <h2 style={{color: "#fe3d00"}}>Success!</h2>
          <p>Accuracy: {accuracy}% | Time: {time}s</p>
          <h3 style={{margin: "10px 0"}}>🪙 {credits} Credits</h3>
          <button onClick={claimCredits} style={styles.mainBtn}>Claim Credits</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;