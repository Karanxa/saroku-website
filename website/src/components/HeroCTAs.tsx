"use client";

import Link from "next/link";

export default function HeroCTAs() {
  return (
    <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
      <Link
        href="/docs"
        className="btn-primary"
        style={{
          backgroundColor: "var(--primary)",
          color: "#FFFFFF",
          padding: "13px 28px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        Read the Docs →
      </Link>
      <a
        href="https://github.com/Karanxa/saroku"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#24292f",
          color: "#ffffff",
          padding: "13px 28px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
          border: "1px solid #24292f",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <GitHubIcon />
        View on GitHub
      </a>
      <a
        href="https://huggingface.co/karanxa/saroku-safety-0.5b"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#FFD21E",
          color: "#1a1a1a",
          padding: "13px 28px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
          border: "1px solid #FFD21E",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <HuggingFaceIcon />
        View on HuggingFace
      </a>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function HuggingFaceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-3.5 6.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5S10 10.828 10 10s-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM12 14c-2.21 0-4 1.343-4 3h8c0-1.657-1.79-3-4-3z" />
    </svg>
  );
}
