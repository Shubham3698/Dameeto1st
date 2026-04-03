import React, { useState, useEffect } from "react";

const PromotionalPopup = ({ loading, navigate }) => {
  const [popupIndex, setPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // Saara Data ab yahi rahega
  const popupList = [
    { 
      title: "🎁 10 DTF-sticker pack", 
      text: "The Wait is Over! 🚀 Grab our first-ever Exclusive 10 DTF Sticker Pack. High-quality, waterproof, and pure madness! 🔥", 
      image: "https://i.pinimg.com/736x/cb/06/9e/cb069e70b3e556abd90693efb343c87f.jpg", 
      link: "/sticker-packs" 
    },
    { 
      title: "🔥 GET FREE STICKERS!", 
      text: "Play games, earn credits, or hit shopping targets and get Premium DTF Stickers for ₹0! 🎮🛍️", 
      image: "https://i.pinimg.com/736x/94/9b/e9/949be92bdc0fce7693370d4c340df5ec.jpg", 
      link: "" 
    },
    { 
      title: "🚀 New Arrival", 
      text: "Learning is Plenty! 🌈 Discover our new Board Books and Play Mats designed for little explorers.", 
      image: "https://i.pinimg.com/736x/ee/81/4e/ee814ed3908c65832b96e51dae1910d6.jpg", 
      link: "/learning-products" 
    },
  ];

  // Popup trigger logic
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleClose = () => {
    if (popupIndex < popupList.length - 1) {
      setPopupIndex(popupIndex + 1);
    } else {
      setShowPopup(false);
    }
  };

  if (!showPopup) return null;

  const currentPopup = popupList[popupIndex];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[10000] p-6">
      <div className="relative w-full max-w-[340px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          className="absolute right-4 top-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 backdrop-blur-md transition-all border border-white/30 group shadow-lg" 
          onClick={handleClose}
        >
          <span className="text-xl">❌</span>
        </button>

        {/* 4:5 Image */}
        <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <img 
            src={currentPopup.image} 
            alt="Promo" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 text-center bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
            {currentPopup.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {currentPopup.text}
          </p>
          
          {currentPopup.link && (
            <button 
              className="w-full bg-[#fe3d00] text-white py-4 rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgba(254,61,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all" 
              onClick={() => { 
                navigate(currentPopup.link); 
                setShowPopup(false); 
              }}
            >
              View More
            </button>
          )}
          {!currentPopup.link && <div className="h-2" />}
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;