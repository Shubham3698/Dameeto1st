import React from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Collaboration() {

  const showComingSoon = () => {
    toast((t) => (
      <div className="flex flex-col items-center gap-3 p-2">
        <p className="text-sm font-medium text-black">
          🚧 Coming Soon...
        </p>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-[#fe3d00] text-white px-4 py-1 rounded-full text-xs"
        >
          OK
        </button>
      </div>
    ), {
      duration: 4000,
      style: {
        borderRadius: "12px",
        background: "#fff",
        color: "#000",
      },
    });
  };

  const CollabCard = () => {
    return (
      <div className="w-[260px] bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">

        {/* 🔥 COLLAB PRODUCT */}
        <div className="relative">
          <img
            src="https://i.pinimg.com/736x/41/24/4e/41244e9d4dbdc0ecb3020fa073b6a202.jpg"
            className="w-full h-[320px] object-cover"
          />

          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
            COLLAB DROP
          </div>

          {/* 🔥 BRAND NAME FIX */}
          <div className="absolute bottom-2 left-2 text-white text-sm font-semibold z-10">
            AU Earbuds × Dameeto
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>

        {/* INFO */}
        <div className="p-3">
          <h2 className="text-white text-sm font-semibold">
            AU Wireless Earbuds Edition
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-400 font-bold">₹1,299</span>
            <span className="text-gray-400 line-through text-xs">₹2,999</span>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            🎧 With sticker combo
          </p>
        </div>

        {/* STRIP */}
        <div className="bg-neutral-800 px-3 py-2 flex items-center gap-3 border-t border-neutral-700">

          <img
            src="https://i.pinimg.com/736x/cb/06/9e/cb069e70b3e556abd90693efb343c87f.jpg"
            className="w-10 h-10 object-cover rounded-md"
          />

          <div className="flex-1">
            <p className="text-xs text-gray-300">Included</p>
            <p className="text-sm text-white font-medium">
              10 DTF Sticker Pack
            </p>
          </div>

          <button
            onClick={showComingSoon}
            className="text-xs bg-white text-black px-2 py-1 rounded-md hover:bg-gray-200"
          >
            View
          </button>
        </div>
      </div>
    );
  };

  const products = [1];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold text-center mb-6">
        🤝 Collaboration Drops
      </h1>

      <div className="flex flex-wrap justify-center gap-5">
        {products.map((_, i) => (
          <CollabCard key={i} />
        ))}
      </div>

    </div>
  );
}