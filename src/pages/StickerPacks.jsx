import React from "react";

export default function StickerPacks() {

  const packs = [
    {
      id: 1,
      name: "1st 10 DTF-sticker pack",
      image: "https://i.pinimg.com/736x/80/07/d8/8007d8ba979d036cb1a6c18aa701f369.jpg",
      price: 259,
      original: 499,
      rating: 4.5,
      launchDate: "10 April",
    },
  ];

  return (
    <div className="p-4 bg-[#fff3eb] min-h-screen">
      <h1 className="text-2xl font-bold text-[#fe3d00] mb-4">
        Sticker Packs 🔥
      </h1>

      <div className="flex flex-col gap-5">
        {packs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            {/* IMAGE SECTION */}
            <div className="relative">

              {/* IMAGE */}
              <div className="aspect-[10/14] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover blur-[2px] brightness-90"
                />
              </div>

              {/* 🔴 TOP BADGE */}
              <div className="absolute top-0 left-0 bg-[#fe3d00] text-white text-sm px-4 py-1 rounded-br-2xl font-semibold">
                Coming Soon
              </div>

              {/* ⏳ CENTER TEXT */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Launching {item.launchDate}
                </div>
              </div>

              {/* ❤️ RIGHT ICON */}
              <div className="absolute top-3 right-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow cursor-pointer">
                  ❤️
                </div>
              </div>

              {/* 🟢 BOTTOM TAG + WISHLIST */}
              <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                <span className="bg-[#0f2d3f] text-white text-xs px-3 py-1 rounded-full">
                  New Drop
                </span>

                <span className="bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full shadow">
                  ❤️ 15 wishlisted
                </span>
              </div>

            </div> {/* ✅ YE MISSING THA */}

            {/* DETAILS */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">
                {item.name}
              </h2>

              <div className="flex items-center gap-2 mt-2 opacity-60">
                <span className="text-xl font-bold text-black">
                  ₹{item.price}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  ₹{item.original}
                </span>
              </div>

              <button
                disabled
                className="mt-4 w-full bg-gray-300 text-gray-600 py-2 rounded-xl font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}