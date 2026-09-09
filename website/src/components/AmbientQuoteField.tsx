"use client";

import { useEffect, useRef, useState } from "react";
import { AI_DANGER_QUOTES } from "@/lib/challenge/aiDangerQuotes";

// Ambient background layer for the challenge hero: several quotes fading
// in/out at once, scattered across the section, instead of one boxed card
// cycling alone. Purely decorative texture behind the real content —
// low opacity, no pointer events, never competes with the CTA for attention.
//
// Two independent slot sets, toggled by CSS media query (not JS breakpoint
// detection, to avoid a hydration mismatch): a full edge-scatter on wide
// screens, and two slim top/bottom bands on narrow ones, since a phone's
// hero is a tall single column with no side margins to scatter text into.

const CYCLE_MS = 7000;

interface Slot {
  top?: string; bottom?: string; left?: string; right?: string;
  width: string; align: "left" | "right" | "center";
  delay: number;
}

const DESKTOP_SLOTS: Slot[] = [
  { top: "6%", left: "3%", width: "260px", align: "left", delay: 0 },
  { top: "10%", right: "3%", width: "260px", align: "right", delay: 1400 },
  { top: "68%", left: "2%", width: "240px", align: "left", delay: 2800 },
  { top: "72%", right: "2%", width: "250px", align: "right", delay: 900 },
  { top: "38%", left: "0.5%", width: "220px", align: "left", delay: 4200 },
  { top: "42%", right: "0.5%", width: "220px", align: "right", delay: 3500 },
];

// Top/bottom bands only, full-width-minus-padding, centered — stay clear
// of the stacked hero content in the middle of the section.
const MOBILE_SLOTS: Slot[] = [
  { top: "1%", left: "8%", right: "8%", width: "auto", align: "center", delay: 0 },
  { bottom: "1%", left: "8%", right: "8%", width: "auto", align: "center", delay: 3500 },
];

function useCyclingQuote(startIndex: number, delay: number, slotCount: number) {
  const [quoteIndex, setQuoteIndex] = useState(startIndex);
  const [visible, setVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setVisible(true);
      started.current = true;
    }, delay);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + slotCount) % AI_DANGER_QUOTES.length);
        setVisible(true);
      }, CYCLE_MS * 0.4);
    }, CYCLE_MS);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { quote: AI_DANGER_QUOTES[quoteIndex], visible };
}

function FloatingQuote({ slot, slotIndex, slotCount, className }: { slot: Slot; slotIndex: number; slotCount: number; className: string }) {
  const { quote, visible } = useCyclingQuote(slotIndex, slot.delay, slotCount);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: slot.top,
        bottom: slot.bottom,
        left: slot.left,
        right: slot.right,
        width: slot.width,
        textAlign: slot.align,
        opacity: visible ? 0.4 : 0,
        transition: `opacity ${CYCLE_MS * 0.4}ms ease`,
        pointerEvents: "none",
      }}
    >
      <p style={{ fontSize: "13px", fontStyle: "italic", color: "var(--muted)", lineHeight: "1.5", margin: "0 0 4px" }}>
        &ldquo;{quote.text}&rdquo;
      </p>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--subtle)", margin: 0 }}>
        {quote.author}
      </p>
    </div>
  );
}

export default function AmbientQuoteField() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {DESKTOP_SLOTS.map((slot, i) => (
        <FloatingQuote key={`d${i}`} slot={slot} slotIndex={i} slotCount={DESKTOP_SLOTS.length} className="ambient-quote-desktop" />
      ))}
      {MOBILE_SLOTS.map((slot, i) => (
        <FloatingQuote key={`m${i}`} slot={slot} slotIndex={i} slotCount={MOBILE_SLOTS.length} className="ambient-quote-mobile" />
      ))}
      <style>{`
        .ambient-quote-mobile { display: none; }
        @media (max-width: 900px) {
          .ambient-quote-desktop { display: none; }
          .ambient-quote-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}
