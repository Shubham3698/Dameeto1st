import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function StickerPacks() {
  const navigate = useNavigate();

  // 🔥 DYNAMIC URL: Localhost aur Render dono pe chalega
  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://serdeptry1st.onrender.com";

  // State mein packs daal rahe hain taaki UI update ho sake
  const [packs, setPacks] = useState([
    {
      id: "stk-pack-1",
      category: "stickers",
      title: "1st 10 DTF-Sticker Pack",
      shortDesc: "Premium 10-piece waterproof sticker collection",
      longDesc: "Our first exclusive premium 10 DTF-sticker pack...",
      finalPrice: 259,
      originalPrice: 499,
      discount: 48,
      rating: 4.8,
      stock: 15,
      wishlistCount: 15, // Default count
      src: "https://i.pinimg.com/736x/80/07/d8/8007d8ba979d036cb1a6c18aa701f369.jpg",
      subImages: [],
      tags: ["stickers", "dtf", "premium", "new-drop"],
    },
  ]);

  const handleViewDetails = (item) => {
    const encodedId = btoa(item.id.toString());
    navigate(`/image/${encodedId}`, { state: { item, category: item.category } });
  };

  // 🔥 WISHLIST TOGGLE FUNCTION
  const handleWishlistClick = async (e, productId) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("Please login to wishlist! ❤️");
      return;
    }

    try {
      // ✅ UPDATED URL: Match with backend 'action/wishlist' route
      const res = await axios.post(`${API_BASE_URL}/api/products/action/wishlist/${productId}`, {
        email: userEmail
      });

      if (res.data.success) {
        toast.success(res.data.status === "added" ? "Wishlisted! 🔥" : "Removed! 💔");
        
        // 🔥 UPDATE UI (15 se 16 ya wapas 15)
        setPacks(prevPacks => 
          prevPacks.map(p => 
            p.id === productId ? { ...p, wishlistCount: res.data.count } : p
          )
        );
      }
    } catch (err) {
      console.error("Wishlist Error:", err);
      // Agar abhi bhi 404 aaye toh console mein check karo URL kya ban raha hai
      toast.error("Error updating wishlist");
    }
  };

  return (
    <div className="p-4 bg-[#fff3eb] min-h-screen">
      <h1 className="text-2xl font-bold text-[#fe3d00] mb-4">Sticker Packs 🔥</h1>

      <div className="flex flex-col gap-5">
        {packs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => handleViewDetails(item)}
          >
            <div className="relative">
              <div className="aspect-[10/14] w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="absolute top-0 left-0 bg-[#fe3d00] text-white text-sm px-4 py-1 rounded-br-2xl font-semibold">
                Live Now
              </div>

              {/* ❤️ HEART ICON */}
              <div 
                className="absolute top-3 right-3 z-10"
                onClick={(e) => handleWishlistClick(e, item.id)}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow active:scale-90 transition-transform">
                  <span className="text-red-500 text-xl">❤️</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                <span className="bg-[#0f2d3f] text-white text-xs px-3 py-1 rounded-full w-fit">
                  {item.category.toUpperCase()}
                </span>
                
                {/* 🔥 WISHLIST COUNT */}
                <span className="bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full shadow font-bold">
                  ❤️ {item.wishlistCount || 0} wishlisted
                </span>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{item.shortDesc}</p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-black text-[#fe3d00]">₹{item.finalPrice}</span>
                <span className="line-through text-gray-400 text-sm">₹{item.originalPrice}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(item);
                }}
                className="mt-4 w-full bg-[#fe3d00] text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all"
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