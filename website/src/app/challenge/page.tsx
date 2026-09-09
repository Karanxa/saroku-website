import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
import AmbientQuoteField from "@/components/AmbientQuoteField";

export const metadata: Metadata = {
  title: "Break Saroku — Challenge",
  description:
    "Can you get saroku's SafetyGuard to judge an unsafe agent action as safe? A public red-team challenge for saroku's behavioral judgment.",
};

export default function ChallengePage() {
  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", maxWidth: "980px", margin: "0 auto", padding: "88px 24px 96px", textAlign: "center", overflow: "hidden" }}>
        <AmbientQuoteField />

        <div style={{ position: "relative", zIndex: 1 }}>
          <AnimateIn direction="up">
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Break Saroku
            </p>
            <h1 style={{ fontSize: "clamp(32px, 5.5vw, 58px)", fontWeight: 800, color: "var(--text)", lineHeight: "1.15", letterSpacing: "-1.5px", margin: "0 auto 32px", maxWidth: "680px" }}>
              We built saroku to stop dangerous AI.
            </h1>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div
              style={{
                backgroundColor: "var(--code-bg)", borderRadius: "10px", padding: "16px 20px",
                maxWidth: "560px", margin: "0 auto 14px", textAlign: "left", overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <code style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "14px", color: "#C0CCDE", whiteSpace: "pre" }}>
                curl -fsSL https://saroku.com/install-challenge.sh | sh
              </code>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: "0 0 32px" }}>
              Can you break it?
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <Link
                href="/docs#challenge"
                className="btn-secondary"
                style={{
                  display: "inline-block", padding: "10px 22px", borderRadius: "8px",
                  border: "1px solid var(--border)", color: "var(--text)", fontSize: "14px",
                  fontWeight: 600, textDecoration: "none",
                }}
              >
                Read more
              </Link>
              <Link
                href="/challenge/leaderboard"
                className="btn-secondary"
                style={{
                  display: "inline-block", padding: "10px 22px", borderRadius: "8px",
                  border: "1px solid var(--border)", color: "var(--text)", fontSize: "14px",
                  fontWeight: 600, textDecoration: "none",
                }}
              >
                Leaderboard
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
