import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
import QuoteCarousel from "@/components/QuoteCarousel";
import {
  getChallengeData,
  CHALLENGE_PROPERTIES,
  SCENARIOS_PER_PROPERTY,
} from "./ChallengeData";

export const metadata: Metadata = {
  title: "Break Saroku — Challenge",
  description:
    "Can you get saroku's SafetyGuard to judge an unsafe agent action as safe? A public red-team challenge for saroku's behavioral judgment.",
};

export const dynamic = "force-dynamic";

const PROPERTY_LABELS: Record<string, string> = {
  sycophancy: "Sycophancy",
  honesty: "Honesty",
  consistency: "Consistency",
  prompt_injection: "Prompt Injection",
  trust_hierarchy: "Trust Hierarchy",
  minimal_footprint: "Minimal Footprint",
  goal_drift: "Goal Drift",
  corrigibility: "Corrigibility",
};

export default async function ChallengePage() {
  const { breakdownByProperty } = await getChallengeData();

  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "980px", margin: "0 auto", padding: "88px 24px 64px", textAlign: "center" }}>
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
            Try to break it.
          </p>
        </AnimateIn>

        <AnimateIn delay={140}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
              What AI researchers are actually saying
            </p>
            <QuoteCarousel />
          </div>
        </AnimateIn>

        <AnimateIn direction="up" delay={100}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
            {["Python 3.10+", "Bring your own LLM API key", "macOS · Linux · Windows (WSL)"].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: "12px", fontWeight: 600, color: "var(--muted)", backgroundColor: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: "999px", padding: "5px 14px",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "17px", maxWidth: "620px", margin: "0 auto 28px", lineHeight: "1.6" }}>
            Can you get saroku&apos;s <code style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--primary)" }}>SafetyGuard</code> to
            judge an unsafe agent action as safe?
          </p>
          <Link
            href="/challenge/leaderboard"
            className="btn-secondary"
            style={{
              display: "inline-block", padding: "10px 22px", borderRadius: "8px",
              border: "1px solid var(--border)", color: "var(--text)", fontSize: "14px",
              fontWeight: 600, textDecoration: "none",
            }}
          >
            View Leaderboard →
          </Link>
        </AnimateIn>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 24px" }}>
          <AnimateIn direction="up">
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", textAlign: "center", margin: "0 0 48px" }}>
              How it works
            </h2>
          </AnimateIn>

          <AnimateIn delay={80}>
            <div className="howitworks-flow" style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: "0" }}>
              {[
                { n: "1", title: "Install & attempt", body: "Run the challenge harness locally with your own LLM API key. Try to construct a scenario that gets a labeled-unsafe action judged safe." },
                { n: "2", title: "It pings us the moment you break it", body: "The instant your local guard misjudges an action, the harness automatically notifies saroku — before you do anything else." },
                { n: "3", title: "Come back and verify", body: "Submit your transcript here. We independently re-run it through the real guard on our own infrastructure — that's what actually earns credit." },
              ].map((step, i, arr) => (
                <div key={step.n} style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 0 }}>
                  <div
                    className="pipeline-stage"
                    style={{
                      backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px",
                      padding: "22px", flex: 1, display: "flex", flexDirection: "column",
                    }}
                  >
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--primary-t)",
                      color: "var(--primary)", fontFamily: "var(--font-jetbrains), monospace", fontSize: "13px",
                      fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px",
                    }}>
                      {step.n}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)", marginBottom: "8px" }}>{step.title}</div>
                    <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", margin: 0 }}>{step.body}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ display: "flex", alignItems: "center", color: "var(--subtle)", fontSize: "22px", padding: "0 14px", flexShrink: 0 }} aria-hidden>
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AnimateIn>

          <style>{`
            @media (max-width: 760px) {
              .howitworks-flow { flex-direction: column; }
              .howitworks-flow > div { flex-direction: column; }
              .howitworks-flow > div > span { transform: rotate(90deg); padding: 10px 0 !important; align-self: center; }
            }
          `}</style>
        </div>
      </section>

      {/* ─── Per-property breakdown ────────────────────────────────────── */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 24px" }}>
        <AnimateIn direction="up">
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", textAlign: "center", margin: "0 0 40px" }}>
            Challenge Set v1 — 48 scenarios, 8 properties
          </h2>
        </AnimateIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {CHALLENGE_PROPERTIES.map((prop, i) => (
            <AnimateIn key={prop} delay={i * 40}>
              <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "10px" }}>
                  {PROPERTY_LABELS[prop] ?? prop}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)" }}>
                  <span>{SCENARIOS_PER_PROPERTY} scenarios</span>
                  <span style={{ color: breakdownByProperty[prop] > 0 ? "var(--danger)" : "var(--subtle)", fontWeight: 600 }}>
                    {breakdownByProperty[prop]} verified break{breakdownByProperty[prop] === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
