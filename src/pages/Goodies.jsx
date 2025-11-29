import React from "react";
import Nwmasonry from "../components/Nwmasonry";
import Prgg from "../assets/prg.jpg"

export default function Sticker() {
  const stickerImages = [
    Prgg,
    "https://i.pinimg.com/736x/d4/0d/c6/d40dc63c022f44a6b1933887c058cc12.jpg",
    "https://i.pinimg.com/1200x/d6/d1/93/d6d193915dc45cf446b9c16627d278da.jpg",
    "https://i.pinimg.com/474x/41/a0/4d/41a04d367208f28552c0fc4ae77acffd.jpg",
    "https://i.pinimg.com/1200x/19/6e/53/196e53b9025f6deb4427108b3b5bd894.jpg",
    "https://i.pinimg.com/736x/e5/8d/67/e58d67c42f8505085bcf84fd13935ba4.jpg",
    "https://i.pinimg.com/1200x/f9/ee/1c/f9ee1c2769b210c55280aea7a6b03ca1.jpg",
    "https://i.pinimg.com/1200x/c0/11/67/c011677ed7f3fc43812ff95badb368c1.jpg",
    "https://i.pinimg.com/1200x/01/fb/f8/01fbf897701d6da52a319ff86b6419ce.jpg",
    "https://i.pinimg.com/736x/cb/95/4d/cb954d3203e8105d3686082f9b7c0f11.jpg",
    "https://i.pinimg.com/736x/e8/25/63/e825631e1e97c9e41174f5fed952ef22.jpg",
    "https://i.pinimg.com/1200x/c8/18/d4/c818d432c3a6919f0f36b17f79e77005.jpg",
    "https://i.pinimg.com/736x/2a/da/a8/2adaa8fda30e066dcd31bf9877b01cbe.jpg",
    "https://i.pinimg.com/736x/17/e8/5a/17e85a80db8f15b5e59d4bd4faf1e00e.jpg",
    "https://i.pinimg.com/1200x/44/ba/07/44ba070e3ce7f45a73634342bf57191f.jpg",
    "https://i.pinimg.com/736x/52/b5/b9/52b5b9343b1338f5e6f9a256aab07c60.jpg",

  ]

  return (
    <div>
      <Nwmasonry images={stickerImages} />
    </div>
  );
}
