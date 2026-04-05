import React from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Collaboration() {

  // 🔥 Coming Soon Popup
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

  // 🔥 PRODUCTS ARRAY (Multiple Items)
  const products = [
    {
      id: 1,
      title: "AU Wireless Earbuds Edition",
      price: 1299,
      original: 2999,
      image: "https://i.pinimg.com/736x/41/24/4e/41244e9d4dbdc0ecb3020fa073b6a202.jpg",
      brand: "AU Earbuds × Dameeto",
      extra: "🎧 With sticker combo",
      includedImg: "https://i.pinimg.com/736x/cb/06/9e/cb069e70b3e556abd90693efb343c87f.jpg",
      includedText: "10 DTF Sticker Pack"
    },
    {
      id: 2,
      title: "iPhone 16 Premium Case",
      price: 1799,
      original: 3499,
      image: "https://i.pinimg.com/736x/e4/1f/d2/e41fd2bd6e566ae8da36f788022ad5e2.jpg",
      brand: "Dameeto × StreetCase",
      extra: "📱 Matte finish + aesthetic design",
      includedImg: "https://i.pinimg.com/736x/80/07/d8/8007d8ba979d036cb1a6c18aa701f369.jpg",
      includedText: "sticker-pack"
    }
  ];

  // 🔥 CARD COMPONENT
  const CollabCard = ({ item }) => {
    return (
      <div className="w-[260px] bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={item.image}
            className="w-full h-[320px] object-cover"
          />

          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
            COLLAB DROP
          </div>

          <div className="absolute bottom-2 left-2 text-white text-sm font-semibold z-10">
            {item.brand}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>

        {/* INFO */}
        <div className="p-3">
          <h2 className="text-white text-sm font-semibold">
            {item.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-400 font-bold">₹{item.price}</span>
            <span className="text-gray-400 line-through text-xs">₹{item.original}</span>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {item.extra}
          </p>
        </div>

        {/* STRIP */}
        <div className="bg-neutral-800 px-3 py-2 flex items-center gap-3 border-t border-neutral-700">

          <img
            src={item.includedImg}
            className="w-10 h-10 object-cover rounded-md"
          />

          <div className="flex-1">
            <p className="text-xs text-gray-300">Included</p>
            <p className="text-sm text-white font-medium">
              {item.includedText}
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

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold text-center mb-6">
        🤝 Collaboration Drops
      </h1>

      {/* PRODUCTS */}
      <div className="flex flex-wrap justify-center gap-5">
        {products.map((item) => (
          <CollabCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  );
}