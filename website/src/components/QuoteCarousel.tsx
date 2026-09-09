"use client";

import { useEffect, useState } from "react";
import { AI_DANGER_QUOTES } from "@/lib/challenge/aiDangerQuotes";

const INTERVAL_MS = 4200;
const FADE_MS = 550;

export default function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % AI_DANGER_QUOTES.length);
        setVisible(true);
      }, FADE_MS);
      return () => clearTimeout(swap);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const q = AI_DANGER_QUOTES[index];

  return (
    <div
      style={{
        maxWidth: "620px", margin: "0 auto", minHeight: "168px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px",
          padding: "28px 32px", width: "100%", textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        }}
      >
        <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: "1.6", margin: "0 0 16px", fontStyle: "italic" }}>
          &ldquo;{q.text}&rdquo;
        </p>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-2)", margin: "0 0 2px" }}>
          {q.author}
        </p>
        <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
          {q.role}
        </p>
      </div>
    </div>
  );
}
