"use client";

import { useState } from "react";

interface TranscriptFile {
  scenario_id?: string;
  property?: string;
  context?: string;
  action?: string;
  full_conversation?: unknown[];
  claim_token?: string;
}

type Status = "idle" | "submitting" | "verified" | "flagged" | "rejected" | "error";

export default function VerifyForm() {
  const [instanceId, setInstanceId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(setTranscriptText);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    let transcript: TranscriptFile;
    try {
      transcript = JSON.parse(transcriptText);
    } catch {
      setStatus("error");
      setMessage("That doesn't look like valid JSON — paste or upload the transcript file exactly as the CLI wrote it.");
      return;
    }

    if (!transcript.claim_token) {
      setStatus("error");
      setMessage("This transcript has no claim_token field — make sure you're uploading the file the CLI saved, not a copy you edited.");
      return;
    }
    if (!instanceId.trim()) {
      setStatus("error");
      setMessage("Enter your instance_id — the CLI printed this the first time you ran it.");
      return;
    }

    try {
      const res = await fetch("/api/challenge/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instance_id: instanceId.trim(),
          claim_token: transcript.claim_token,
          display_name: displayName.trim() || undefined,
          transcript: {
            scenario_id: transcript.scenario_id,
            context: transcript.context,
            action: transcript.action,
            full_conversation: transcript.full_conversation,
          },
        }),
      });
      const body = await res.json();

      if (res.status === 200 && body.status === "verified") {
        setStatus("verified");
        setMessage(`Verified — ${body.property ?? "property"} on ${body.scenario_id}. Check the leaderboard.`);
      } else if (body.status === "flagged") {
        setStatus("flagged");
        setMessage(
          body.reason === "no_matching_ping"
            ? "No matching check-in ping found for this instance/scenario — this submission is flagged for review, not accepted. Did you run the CLI's actual attempt before submitting?"
            : `Flagged for review: ${body.reason}`
        );
      } else if (body.status === "rejected" && body.reason === "replay_did_not_reproduce_break") {
        setStatus("rejected");
        setMessage("Independent replay did not reproduce the misjudgment — the real guard correctly caught it server-side. Not verified.");
      } else if (res.status === 403) {
        setStatus("rejected");
        setMessage("Claim token didn't validate — this submission wasn't produced by a real check-in on this instance.");
      } else if (res.status === 404) {
        setStatus("rejected");
        setMessage("No check-in found for that instance_id. Run the CLI first.");
      } else if (res.status === 429) {
        setStatus("rejected");
        setMessage("Rate limited — too many verify attempts from this instance today. Try again later.");
      } else {
        setStatus("rejected");
        setMessage(`Not verified: ${body.reason ?? body.error ?? "unknown reason"}`);
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the verification service. Try again in a moment.");
    }
  }

  const statusColor =
    status === "verified" ? "var(--success)" :
    status === "flagged" ? "var(--warning)" :
    status === "rejected" || status === "error" ? "var(--danger)" :
    "var(--muted)";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "6px" }}>
          Instance ID
        </label>
        <input
          type="text"
          value={instanceId}
          onChange={(e) => setInstanceId(e.target.value)}
          placeholder="Printed by the CLI on first run"
          style={{
            width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)",
            backgroundColor: "var(--surface)", color: "var(--text)", fontSize: "14px",
            fontFamily: "var(--font-jetbrains), monospace", boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "6px" }}>
          Display name <span style={{ fontWeight: 400, color: "var(--subtle)" }}>(optional — leave blank to stay anonymous)</span>
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Anonymous"
          style={{
            width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)",
            backgroundColor: "var(--surface)", color: "var(--text)", fontSize: "14px", boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "6px" }}>
          Transcript
        </label>
        <input type="file" accept=".json,application/json" onChange={handleFile} style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "8px" }} />
        <textarea
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="...or paste the transcript JSON directly"
          rows={8}
          style={{
            width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)",
            backgroundColor: "var(--code-bg)", color: "#C0CCDE", fontSize: "13px",
            fontFamily: "var(--font-jetbrains), monospace", boxSizing: "border-box", resize: "vertical",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary"
        style={{
          padding: "12px 24px", borderRadius: "8px", backgroundColor: "var(--primary-h)",
          color: "#FFFFFF", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
          opacity: status === "submitting" ? 0.6 : 1,
        }}
      >
        {status === "submitting" ? "Verifying..." : "Verify"}
      </button>

      {message && (
        <p style={{ fontSize: "14px", color: statusColor, lineHeight: "1.6", margin: 0 }}>
          {message}
        </p>
      )}
    </form>
  );
}
