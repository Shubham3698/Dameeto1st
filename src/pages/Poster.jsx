import React from "react";
import Nwmasonry from "../components/Nwmasonry";

export default function Poster() {
  const stickerImages = [
    {
      src: "https://i.pinimg.com/originals/5e/52/03/5e5203bc54a8b079e74b99f79a282317.gif",
      title: "Retro Motion Poster",
      shortDesc: "Animated retro-style poster.",
      longDesc:
        "High-quality retro animation poster ideal for room walls, studios and aesthetic décor."
    },
    {
      src: "https://i.pinimg.com/1200x/45/92/05/459205eebadf7b7d58be92bb1286a971.jpg",
      title: "Vintage Art Poster",
      shortDesc: "Classic art-theme poster.",
      longDesc:
        "Perfect wall-art poster reflecting vintage culture, style, and personality expression."
    },
    {
      src: "https://i.pinimg.com/736x/60/2c/d7/602cd7ebc5cd8c71aef67b4338fb1997.jpg",
      title: "Moody Character Poster",
      shortDesc: "High-resolution character art.",
      longDesc:
        "A premium moody poster with expressive details ideal for aesthetic lovers."
    },
    {
      src: "https://i.pinimg.com/1200x/13/43/a4/1343a43b4cc2701abdebead55c908a63.jpg",
      title: "Cyberpunk Poster",
      shortDesc: "Futuristic neon artwork.",
      longDesc:
        "Perfect for room décor, gamers, coders and sci-fi lovers showing futuristic vibes."
    },
    {
      src: "https://i.pinimg.com/736x/52/36/6e/52366e37d38373ea59177a52a356c4f6.jpg",
      title: "Aesthetic Girl Poster",
      shortDesc: "Elegant portrait art.",
      longDesc:
        "Soft aesthetic poster crafted for calm energy, personality and modern expression."
    },
    {
      src: "https://i.pinimg.com/1200x/62/d7/ff/62d7ffd8a9e5f0991af281abe8c94f7d.jpg",
      title: "Dark Themed Poster",
      shortDesc: "Bold dramatic artwork.",
      longDesc:
        "Ideal for aesthetic wall setups showcasing strong, bold and emotional tones."
    },
    {
      src: "https://i.pinimg.com/736x/38/cc/af/38ccaf73cc226ac98d1f7c653af2ca86.jpg",
      title: "Minimal Character Poster",
      shortDesc: "Clean minimal art.",
      longDesc:
        "Simple, clean and modern poster suitable for any wall aesthetic or workspace."
    },
    {
      src: "https://i.pinimg.com/1200x/81/5c/62/815c62fa8e4fe8404a7ae60c3e3d1a02.jpg",
      title: "Creative Portrait Poster",
      shortDesc: "Premium artistic design.",
      longDesc:
        "Crafted for art lovers who enjoy storytelling visuals and expressive artworks."
    },
    {
      src: "https://i.pinimg.com/736x/5d/58/23/5d582381b3707b973548167a5aa99d80.jpg",
      title: "Modern Art Poster",
      shortDesc: "Trendy new-gen poster.",
      longDesc:
        "A stylish modern poster representing bold themes, emotions and individuality."
    },
    {
      src: "https://i.pinimg.com/736x/cf/a3/ae/cfa3ae0c9a718fea7295e7f07887c38e.jpg",
      title: "Cool Aesthetic Poster",
      shortDesc: "Balance of vibes & style.",
      longDesc:
        "Perfect for modern rooms, offices and personality-driven wall decoration."
    }
  ];

  return <Nwmasonry images={stickerImages} categoryName="poster" />;
}
