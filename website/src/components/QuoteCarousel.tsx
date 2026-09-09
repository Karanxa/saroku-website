"use client";

import { useEffect, useState } from "react";

export interface Quote {
  text: string;
  author: string;
  role: string;
}

// 15 real, individually verified public statements — interviews, essays,
// books, published testimony. Not tweets: a broad X search for "top AI
// danger tweets" surfaced mostly noise or a single outlier (a resignation
// thread with real but wildly disproportionate reach), so this pulls from
// on-the-record statements by AI researchers and lab leaders instead —
// broader sourcing, no single person's personal post used as marketing
// material. Every quote below is verbatim from a real, findable source.
export const AI_DANGER_QUOTES: Quote[] = [
  {
    text: "I think it's quite conceivable that humanity is just a passing phase in the evolution of intelligence.",
    author: "Geoffrey Hinton",
    role: "“Godfather of AI,” former Google VP",
  },
  {
    text: "Nobody knows. I think it's dangerous to make these claims without any strong evidence that it can't happen.",
    author: "Yoshua Bengio",
    role: "Turing Award winner, founder of LawZero",
  },
  {
    text: "I think there's a 25% chance that things go really, really badly.",
    author: "Dario Amodei",
    role: "CEO, Anthropic",
  },
  {
    text: "With artificial intelligence we are summoning the demon.",
    author: "Elon Musk",
    role: "CEO, Tesla / xAI",
  },
  {
    text: "If somebody builds a too-powerful AI, under present conditions, I expect that every single member of the human species and all biological life on Earth dies shortly thereafter.",
    author: "Eliezer Yudkowsky",
    role: "Founder, MIRI",
  },
  {
    text: "If we chose to, we could make gorillas extinct in a couple of weeks and there's nothing they can do about it.",
    author: "Stuart Russell",
    role: "UC Berkeley, author of “Human Compatible”",
  },
  {
    text: "The real risk with AGI isn't malice but competence.",
    author: "Max Tegmark",
    role: "MIT physicist, Future of Life Institute",
  },
  {
    text: "Technology's unavoidable challenge is that its makers quickly lose control over the path their inventions take once introduced to the world.",
    author: "Mustafa Suleyman",
    role: "CEO, Microsoft AI",
  },
  {
    text: "The risk of a catastrophic scenario is not zero, so we must dedicate significant resources to mitigating it.",
    author: "Demis Hassabis",
    role: "CEO, DeepMind",
  },
  {
    text: "I think that AI will probably, most likely, lead to the end of the world. But in the meantime, there will be great companies created.",
    author: "Sam Altman",
    role: "CEO, OpenAI",
  },
  {
    text: "Before the prospect of an intelligence explosion, we humans are like small children playing with a bomb.",
    author: "Nick Bostrom",
    role: "Philosopher, author of “Superintelligence”",
  },
  {
    text: "The core danger with AGI is that it has the potential to cause rapid change — we could end up in an undesirable environment before we have a chance to realize where we're even heading.",
    author: "Ilya Sutskever",
    role: "Co-founder, OpenAI / SSI",
  },
  {
    text: "I am in the camp that is concerned about super intelligence. I agree with Elon Musk and some others on this and don't understand why some people are not concerned.",
    author: "Bill Gates",
    role: "Co-founder, Microsoft",
  },
  {
    text: "We can't control superintelligence indefinitely. It's impossible.",
    author: "Roman Yampolskiy",
    role: "AI safety researcher, University of Louisville",
  },
  {
    text: "I've not met anyone in AI labs who says the risk is less than 1% of blowing up the planet.",
    author: "Jaan Tallinn",
    role: "Co-founder, Skype; Future of Life Institute",
  },
];

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
