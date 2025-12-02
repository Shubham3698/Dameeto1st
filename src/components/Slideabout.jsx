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
        // Autoplay settings:
        autoplay={{
          delay: 2500,
          // 1. disableOnInteraction: false - सुनिश्चित करता है कि जब आप क्लिक करना छोड़ दें तो Autoplay अपने आप फिर से शुरू हो जाए।
          disableOnInteraction: false,
          // 2. pauseOnMouseEnter: true - यह सुनिश्चित करता है कि जब आप माउस को स्लाइडर पर लाते हैं (hover/click-hold),
          // तो Autoplay रुक जाए। यही वह सेटिंग है जो आपके "क्लिक होल्ड" की आवश्यकता को पूरा करती है।
          pauseOnMouseEnter: true,
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