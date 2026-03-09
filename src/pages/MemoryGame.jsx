import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const symbols = ["🔥","⚡","🌈","💎","🍎","🚗","🍕","🎮","👻","🎸","⚽","🚀"];

const MemoryGame = () => {

const navigate = useNavigate();

const [cards,setCards] = useState([]);
const [flippedCards,setFlippedCards] = useState([]);
const [solved,setSolved] = useState([]);
const [disabled,setDisabled] = useState(false);

const [moves,setMoves] = useState(0);
const [accuracy,setAccuracy] = useState(100);
const [gameFinished,setGameFinished] = useState(false);
const [gameStarted,setGameStarted] = useState(false);

const [time,setTime] = useState(0);
const [timerActive,setTimerActive] = useState(false);
const [credits,setCredits] = useState(0);

const initializeGame = ()=>{

const shuffledCards = [...symbols,...symbols]
.sort(()=>Math.random()-0.5)
.map((symbol,index)=>({id:index,symbol}));

setCards(shuffledCards);
setSolved([]);
setFlippedCards([]);
setMoves(0);
setAccuracy(100);
setGameFinished(false);
setTime(0);
setCredits(0);

setGameStarted(false);
setTimerActive(false);

};

const startGame = ()=>{
setGameStarted(true);
setTimerActive(true);
};

useEffect(()=>{
initializeGame();
},[]);

useEffect(()=>{

let interval;

if(timerActive){
interval=setInterval(()=>{
setTime(t=>t+1);
},1000);
}

return ()=>clearInterval(interval);

},[timerActive]);

useEffect(()=>{

if(moves>12){
const calcAcc=Math.max(10,Math.round((12/moves)*100));
setAccuracy(calcAcc);
}

},[moves]);

useEffect(()=>{
if(gameFinished){
calculateCredits();
}
},[gameFinished]);

const handleClick=(id)=>{

if(!gameStarted || disabled || flippedCards.includes(id) || solved.includes(id)) return;

if(flippedCards.length===1){

setMoves(m=>m+1);
setFlippedCards([...flippedCards,id]);
setDisabled(true);

const firstCard = cards[flippedCards[0]];
const secondCard = cards[id];

if(firstCard.symbol===secondCard.symbol){

const newSolved=[...solved,flippedCards[0],id];

setSolved(newSolved);
setFlippedCards([]);
setDisabled(false);

if(newSolved.length===cards.length){
setGameFinished(true);
setTimerActive(false);
}

}else{

setTimeout(()=>{
setFlippedCards([]);
setDisabled(false);
},700);

}

}else{

setFlippedCards([id]);

}

};

const calculateCredits=()=>{

const accuracyScore=Math.round(accuracy/2);

let speedBonus=0;

if(time<40) speedBonus=30;
else if(time<60) speedBonus=20;
else if(time<120) speedBonus=10;

setCredits(accuracyScore+speedBonus);

};

const claimCredits=async()=>{

try{

await fetch("/api/game-credit",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
credits,
accuracy,
time
})
});

navigate("/account");

}catch(e){
console.log(e);
}

};

const styles={

wrapper:{
background:"#0f172a",
minHeight:"100vh",
width:"100%",
padding:"20px 10px",
color:"white",
display:"flex",
flexDirection:"column",
alignItems:"center",
fontFamily:"sans-serif"
},

statsRow:{
display:"flex",
gap:"15px",
marginBottom:"20px"
},

statBox:{
background:"#1e293b",
padding:"8px 15px",
borderRadius:"8px",
border:"1px solid #fe3d00",
fontSize:"14px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"10px",
width:"100%",
maxWidth:"400px"
},

card:(isFlipped,isSolved)=>({

aspectRatio:"1/1",
cursor:"pointer",
position:"relative",
transformStyle:"preserve-3d",
transition:"transform 0.5s",
transform:isFlipped || isSolved ? "rotateY(180deg)" : "rotateY(0deg)",
opacity:!gameStarted ? 0.5 : 1,
pointerEvents:!gameStarted ? "none" : "auto"

}),

face:{
position:"absolute",
width:"100%",
height:"100%",
backfaceVisibility:"hidden",
borderRadius:"6px",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"24px"
},

back:{
background:"#fe3d00",
color:"white"
},

front:{
background:"white",
color:"#000",
transform:"rotateY(180deg)"
},

modal:{
position:"fixed",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
background:"#1e293b",
padding:"30px",
borderRadius:"20px",
border:"2px solid #fe3d00",
textAlign:"center",
zIndex:100,
width:"90%",
maxWidth:"350px"
}

};

return(

<div style={styles.wrapper}>

<h3 style={{color:"#fe3d00",fontWeight:"bold"}}>Dameeto Memory</h3>

<div style={styles.statsRow}>
<div style={styles.statBox}>Moves: {moves}</div>
<div style={styles.statBox}>Acc: {accuracy}%</div>
<div style={styles.statBox}>Time: {time}s</div>
</div>

<div style={styles.grid}>

{cards.map(card=>{

const isFlipped=flippedCards.includes(card.id);
const isSolved=solved.includes(card.id);

return(

<div key={card.id} style={{perspective:"1000px"}} onClick={()=>handleClick(card.id)}>

<div style={styles.card(isFlipped,isSolved)}>

<div style={{...styles.face,...styles.back}}>?</div>

<div style={{...styles.face,...styles.front}}>
{card.symbol}
</div>

</div>

</div>

);

})}

</div>

{!gameStarted ? (

<button
onClick={startGame}
style={{
marginTop:"30px",
background:"#fe3d00",
color:"white",
padding:"12px 40px",
borderRadius:"25px",
border:"none",
fontWeight:"bold",
fontSize:"18px",
cursor:"pointer"
}}
>

START GAME

</button>

):(

<button
onClick={initializeGame}
style={{
marginTop:"30px",
background:"transparent",
border:"1px solid #ccc",
color:"#ccc",
padding:"8px 20px",
borderRadius:"20px",
cursor:"pointer"
}}
>

Restart Game

</button>

)}

{gameFinished &&(

<div style={styles.modal}>

<h2 style={{color:"#fe3d00"}}>Great Job!</h2>

<p>Accuracy: {accuracy}% | Time: {time}s</p>

<h3 style={{margin:"15px 0"}}>Credits: 🪙 {credits}</h3>

<button
onClick={claimCredits}
style={{
background:"#fe3d00",
border:"none",
color:"white",
padding:"12px 30px",
borderRadius:"30px",
fontWeight:"bold",
cursor:"pointer",
width:"100%"
}}
>

Claim & Go Back

</button>

</div>

)}

</div>

);

};

export default MemoryGame;