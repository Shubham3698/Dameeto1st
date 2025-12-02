import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";

export default function SlideAbout() {
  const slides = [
    {
      title: "Who We Are",
      text: "Dameeto is a brand built on reflection, help you to express vibes, emotions, and individuality through art carfting and favorite goodies",
    },
    {
      title: "Our Vision",
      text: "Our mission is to bring your desk, room, gadgets, and every corner of your lifestyle to life with artistic, bold, and meaningful designs. Dameeto aims to become India’s most loved  crafted aesthetic accessories brand.",
    },
    {
      title: "Quality Promise",
      text: "Premium UV-DTF printing, quality materials and smooth packaging.",
    },
    {
      title: "What Makes Us Special?",
      text: "Every piece reflects emotion, personality and boldness.",
    },
  ];

  const titleStyle = {
    fontWeight: "700",
    fontSize: "26px",
    textAlign: "center",
    marginBottom: "10px",
  };

  const textStyle = {
    fontSize: "17px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  };

  return (
    <>
      {/* ACTIVE DOT CUSTOM COLOR */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: #c4c4c4;
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: #fe3d00 !important;
            width: 18px;
            border-radius: 8px;
          }
        `}
      </style>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        // 🛠️ The modification is here
        autoplay={{
          delay: 2500,
          // This setting makes Autoplay NOT stop when user interacts (like clicking/holding or swiping).
          // However, by default, Swiper's Autoplay will PAUSE when you hover/click-hold on the slider.
          // Since you want it to pause on click-hold, the default behavior of Swiper usually handles this.
          // But to be sure it resumes after interaction, we'll use a setting that works well with this:
          disableOnInteraction: false, 
          pauseOnMouseEnter: true // Optional: Also pauses when mouse is over the slider
        }}
        spaceBetween={20}
        speed={600}
        style={{ paddingBottom: "30px" }}
      >
        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <h3 style={titleStyle}>{item.title}</h3>
            <p style={textStyle}>{item.text}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}