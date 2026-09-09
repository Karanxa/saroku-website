import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn from "@/components/AnimateIn";
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
  const { entries, breakdownByProperty } = await getChallengeData();

  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "980px", margin: "0 auto", padding: "88px 24px 64px", textAlign: "center" }}>
        <AnimateIn direction="up">
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Break Saroku
          </p>
          <h1 style={{ fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.75px", margin: "0 0 20px", lineHeight: "1.3", whiteSpace: "pre-line" }}>
            {"Everyone's debating whether AI can be controlled.\nHere's one small, testable piece of that."}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "17px", maxWidth: "620px", margin: "0 auto 32px", lineHeight: "1.6" }}>
            Can you get saroku&apos;s <code style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--primary)" }}>SafetyGuard</code> to
            judge an unsafe agent action as safe? Install the challenge harness, bring your own LLM
            API key, and try.
          </p>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div
            style={{
              backgroundColor: "var(--code-bg)", borderRadius: "10px", padding: "16px 20px",
              maxWidth: "560px", margin: "0 auto 20px", textAlign: "left", overflow: "auto",
            }}
          >
            <code style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "14px", color: "#C0CCDE" }}>
              curl -fsSL https://saroku.com/install-challenge.sh | sh {"  "}
              <span style={{ color: "var(--subtle)" }}>{"// TODO: not yet hosted"}</span>
            </code>
          </div>
          <p style={{ color: "var(--subtle)", fontSize: "13px" }}>
            Zero cash prize at launch — this is leaderboard credit and a real, verifiable claim, not a bounty.
          </p>
        </AnimateIn>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "64px 24px" }}>
          <AnimateIn direction="up">
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", textAlign: "center", margin: "0 0 40px" }}>
              How it works
            </h2>
          </AnimateIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            {[
              { n: "1", title: "Install & attempt", body: "Run the challenge harness locally with your own LLM API key. Try to construct a scenario that gets a labeled-unsafe action judged safe." },
              { n: "2", title: "It pings us the moment you break it", body: "The instant your local guard misjudges an action, the harness automatically notifies saroku — before you do anything else." },
              { n: "3", title: "Come back and verify", body: "Submit your transcript here. We independently re-run it through the real guard on our own infrastructure — that's what actually earns credit." },
            ].map((step, i) => (
              <AnimateIn key={step.n} delay={i * 80}>
                <div className="pipeline-stage" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "22px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-jetbrains), monospace", marginBottom: "10px" }}>
                    {step.n}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)", marginBottom: "8px" }}>{step.title}</div>
                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6", margin: 0 }}>{step.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
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

      {/* ─── Leaderboard ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px" }}>
          <AnimateIn direction="up">
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", textAlign: "center", margin: "0 0 40px" }}>
              Leaderboard
            </h2>
          </AnimateIn>

          {entries.length === 0 ? (
            <AnimateIn delay={80}>
              <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                <p style={{ color: "var(--muted)", fontSize: "15px", margin: 0 }}>
                  No verified breaks yet — be the first.
                </p>
              </div>
            </AnimateIn>
          ) : (
            <AnimateIn delay={80}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "480px", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>Participant</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>Property</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 600, fontSize: "13px", borderBottom: "2px solid var(--border)" }}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, i) => (
                      <tr key={`${e.scenarioId}-${i}`}>
                        <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--text)" }}>{e.displayName}</td>
                        <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--text-2)" }}>{PROPERTY_LABELS[e.property] ?? e.property}</td>
                        <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-2)", color: "var(--subtle)" }}>{new Date(e.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
