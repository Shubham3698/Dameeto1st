import React, { useState } from "react";

export default function FAQ() {
  const faqData = [
    {
      question: "What makes people choose Dameeto stickers?",
      answer:
        "Dameeto stickers are crafted for reflection. People use the stickers to reflect stories, emotions, expression, profession, identity, vibes, and individuality."
    },
    {
      question: "Are your stickers waterproof?",
      answer:
        "Yes! Our stickers are waterproof, scratch-proof, and UV-protected using premium UV-DTF printing that ensures your long lasting reflection."
    },
    {
      question: "How long will my order take to arrive?",
      answer:
        "Orders are shipped within 24–48 hours and typically delivered between 3–6 working days."
    },
    {
      question: "Do you accept returns?",
      answer:
        "Yes, we accept returns only in case of damaged or incorrect products received."
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ background: "#fff3eb", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontWeight: "900", marginBottom: "20px" }}>
        Frequently Asked Questions
      </h2>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {faqData.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "10px",
              marginBottom: "10px",
              padding: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
            onClick={() => toggleFAQ(index)}
          >
            <div
              style={{
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
              }}
            >
              {item.question}
              <span style={{ fontSize: "22px" }}>
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#444",
                  lineHeight: "1.6",
                  fontSize: "15px",
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
