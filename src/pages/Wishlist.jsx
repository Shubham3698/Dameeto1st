import React, { useContext, useEffect } from "react";
import { WishlistContext } from "../contexAndhooks/WishlistContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const { wishlist, fetchWishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ID encode helper
  const encodeId = (id) => btoa(id);

  return (
    <div className="bg-[#fff3eb] min-h-screen p-4">
      {/* Page Title */}
      <h2 className="text-center text-[#fe3d00] text-2xl font-extrabold my-6 tracking-tight">
        My Favorites ❤️
      </h2>

      {wishlist && wishlist.length > 0 ? (
        /* 2-Column Grid for Mobile, 3/4 for Desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* --- Delete Button (Top Right Overlay) --- */}
              <button 
                onClick={() => toggleWishlist(item)}
                className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 shadow-sm active:scale-90 transition-transform"
              >
                <FaTrash size={12} />
              </button>

              {/* --- Product Image Section --- */}
              <div 
                onClick={() => navigate(`/image/${encodeId(item.id)}`)}
                className="cursor-pointer overflow-hidden aspect-square"
              >
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* --- Info Section --- */}
              <div className="p-3">
                <h3 className="text-gray-800 text-sm font-semibold truncate leading-tight">
                  {item.title}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[#fe3d00] text-lg font-bold">
                    ₹{item.finalPrice || item.price}
                  </span>
                  {/* Category tag - Optional decoration */}
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-medium">
                    {item.category || "Art"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Wishlist State */
        <div className="flex flex-col items-center justify-center mt-24 px-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-3xl">🏜️</span>
          </div>
          <p className="text-gray-500 text-lg">Your wishlist feels a bit lonely.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-6 border-2 border-[#fe3d00] text-[#fe3d00] px-8 py-3 rounded-full font-bold hover:bg-[#fe3d00] hover:text-white transition-all duration-300 active:scale-95"
          >
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
}