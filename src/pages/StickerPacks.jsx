import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// Data import kiya
import { stickerPacksData } from "../contexAndhooks/Ddata";

export default function StickerPacks() {
  const navigate = useNavigate();

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  // Initial state ab imported data se ban rahi hai
  const [packs, setPacks] = useState(stickerPacksData);

  // 🔥 Database se latest wishlist counts fetch karne ka logic
  useEffect(() => {
    const fetchLatestCounts = async () => {
      try {
        const updatedPacks = await Promise.all(
          packs.map(async (pack) => {
            try {
              const res = await axios.get(`${API_BASE_URL}/api/products/single/${pack.id}`);
              // Agar DB mein product hai, toh uska real-time count lo
              return { ...pack, wishlistCount: res.data.wishlistCount || pack.wishlistCount };
            } catch (e) {
              return pack; // Error par static data hi dikhao
            }
          })
        );
        setPacks(updatedPacks);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchLatestCounts();
  }, []); 

  const handleViewDetails = (item) => {
    const encodedId = btoa(item.id.toString());
    navigate(`/image/${encodedId}`, { state: { item, category: item.category } });
  };

  const handleWishlistClick = async (e, productId) => {
    e.stopPropagation(); 
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("Please login to wishlist! ❤️");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products/action/wishlist/${productId}`, {
        email: userEmail
      });

      if (res.data.success) {
        toast.success(res.data.status === "added" ? "Wishlisted! 🔥" : "Removed! 💔");
        
        // Local UI state ko DB response ke sath turant update karo
        setPacks(prevPacks => 
          prevPacks.map(p => 
            p.id === productId ? { ...p, wishlistCount: res.data.count } : p
          )
        );
      }
    } catch (err) {
      console.error("Wishlist Error:", err);
      toast.error("Error updating wishlist");
    }
  };

  return (
    <div className="p-4 bg-[#fff3eb] min-h-screen">
      <h1 className="text-2xl font-bold text-[#fe3d00] mb-6 font-black uppercase">Sticker Packs 🔥</h1>

      <div className="flex flex-col gap-6">
        {packs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Image & Badges Section */}
            <div className="relative">
              <div className="aspect-[10/14] w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-0 left-0 bg-[#fe3d00] text-white text-[10px] px-4 py-1.5 rounded-br-2xl font-black uppercase tracking-tighter">
                Dameeto Drop
              </div>

              <div 
                className="absolute top-3 right-3 z-10 cursor-pointer"
                onClick={(e) => handleWishlistClick(e, item.id)}
              >
                <div className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                  <span className="text-red-500 text-2xl">❤️</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 flex flex-col gap-2">
                <span className="bg-[#0f2d3f] text-white text-[10px] px-3 py-1 rounded-full w-fit font-bold tracking-widest">
                  {item.category.toUpperCase()}
                </span>
                <span className="bg-white/95 text-gray-800 text-[11px] px-3 py-1 rounded-full shadow-sm font-black">
                  ❤️ {item.wishlistCount} WISHLISTED
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-5">
              <h2 className="text-xl font-black text-gray-800 leading-tight mb-2">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-4 font-medium">{item.shortDesc}</p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-black text-[#fe3d00]">₹{item.finalPrice}</span>
                <span className="line-through text-gray-400 text-sm font-bold">₹{item.originalPrice}</span>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  -{item.discount}%
                </span>
              </div>

              <button
                onClick={() => handleViewDetails(item)}
                className="w-full bg-[#fe3d00] text-white py-4 rounded-2xl font-black shadow-[0_8px_20px_rgba(254,61,0,0.3)] active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}