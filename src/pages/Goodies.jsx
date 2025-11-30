import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import Prgg from "../assets/prg.jpg";

export default function Goodies() {
  const stickerImages = [
    {
      src: Prgg,
      title: "Premium Goodies Pack",
      shortDesc: "Exclusive custom design.",
      longDesc:
        "A premium goodies item crafted for unique style, vibes, and personal expression."
    },
    {
      src: "https://i.pinimg.com/736x/d4/0d/c6/d40dc63c022f44a6b1933887c058cc12.jpg",
      title: "Cute Aesthetic Goodie",
      shortDesc: "Glossy finish aesthetic.",
      longDesc:
        "Perfect for custom diaries, phone covers, laptops, and decor lovers."
    },
    {
      src: "https://i.pinimg.com/1200x/d6/d1/93/d6d193915dc45cf446b9c16627d278da.jpg",
      title: "Moody Art Goodie",
      shortDesc: "High-resolution art.",
      longDesc:
        "Ideal for those who love expressive art and stylish mood-based designs."
    },
    {
      src: "https://i.pinimg.com/474x/41/a0/4d/41a04d367208f28552c0fc4ae77acffd.jpg",
      title: "Soft Character Accessory",
      shortDesc: "Minimal character design.",
      longDesc:
        "Aesthetic and soft-toned accessory for modern youth expression."
    },
    {
      src: "https://i.pinimg.com/1200x/19/6e/53/196e53b9025f6deb4427108b3b5bd894.jpg",
      title: "Classic Illustration Goodie",
      shortDesc: "Matte finish piece.",
      longDesc:
        "Perfect for notebooks, diaries, planners, and room decoration."
    },
    {
      src: "https://i.pinimg.com/736x/e5/8d/67/e58d67c42f8505085bcf84fd13935ba4.jpg",
      title: "Anime Goodie Art",
      shortDesc: "Glossy anime artwork.",
      longDesc:
        "Designed for anime fans who want expressive and vibey accessories."
    },
    {
      src: "https://i.pinimg.com/1200x/f9/ee/1c/f9ee1c2769b210c55280aea7a6b03ca1.jpg",
      title: "Dark Mood Goodie",
      shortDesc: "Aesthetic dark tone.",
      longDesc:
        "Perfect for modern aesthetics and dramatic personality expression."
    },
    {
      src: "https://i.pinimg.com/1200x/c0/11/67/c011677ed7f3fc43812ff95badb368c1.jpg",
      title: "Artistic Portrait Goodie",
      shortDesc: "Clean portrait design.",
      longDesc:
        "Crafted for art lovers, suitable for diaries and workspace décor."
    },
    {
      src: "https://i.pinimg.com/1200x/01/fb/f8/01fbf897701d6da52a319ff86b6419ce.jpg",
      title: "Cool Girl Illustration",
      shortDesc: "Trendy aesthetic art.",
      longDesc:
        "Perfect for expressing personal vibes and modern graphic style."
    },
    {
      src: "https://i.pinimg.com/736x/cb/95/4d/cb954d3203e8105d3686082f9b7c0f11.jpg",
      title: "Clean Aesthetic Goodie",
      shortDesc: "Soft visual theme.",
      longDesc:
        "Adds a gentle vibe and pleasant mood to personal accessories."
    },
    {
      src: "https://i.pinimg.com/736x/e8/25/63/e825631e1e97c9e41174f5fed952ef22.jpg",
      title: "Modern Art Accessory",
      shortDesc: "New-gen art design.",
      longDesc:
        "Reflects youth style, individuality, and clean visual appeal."
    },
    {
      src: "https://i.pinimg.com/1200x/c8/18/d4/c818d432c3a6919f0f36b17f79e77005.jpg",
      title: "Creative Vibes Goodie",
      shortDesc: "Vibe-based artwork.",
      longDesc:
        "Aesthetic design perfect for notebooks, planners, and wall decoration."
    },
    {
      src: "https://i.pinimg.com/736x/2a/da/a8/2adaa8fda30e066dcd31bf9877b01cbe.jpg",
      title: "Character Mood Goodie",
      shortDesc: "Expressive emotion art.",
      longDesc:
        "Designed for mood lovers who want to show personality & emotions visually."
    },
    {
      src: "https://i.pinimg.com/736x/17/e8/5a/17e85a80db8f15b5e59d4bd4faf1e00e.jpg",
      title: "Soft Pastel Goodie",
      shortDesc: "Pastel aesthetic.",
      longDesc:
        "Aesthetic pastel tones suitable for journaling, decoration and accessories."
    },
    {
      src: "https://i.pinimg.com/1200x/44/ba/07/44ba070e3ce7f45a73634342bf57191f.jpg",
      title: "Elegant Art Goodie",
      shortDesc: "Premium art quality.",
      longDesc:
        "Great for gifting, journaling and making accessories look premium."
    },
    {
      src: "https://i.pinimg.com/736x/52/b5/b9/52b5b9343b1338f5e6f9a256aab07c60.jpg",
      title: "Bold Aesthetic Goodie",
      shortDesc: "Vibrant design.",
      longDesc:
        "Adds boldness, personality and vibrant emotions to personal items."
    }
  ];

  return (
    <div>
      <Nwmasonry images={stickerImages} categoryName="Goodies" />
    </div>
  );
}
