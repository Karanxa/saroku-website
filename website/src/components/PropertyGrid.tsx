"use client";

import { useState } from "react";

interface PropertyGridProps {
  properties: readonly string[];
  labels: Record<string, string>;
  briefs: Record<string, string>;
  scenariosPerProperty: number;
  breakdownByProperty: Record<string, number>;
}

export default function PropertyGrid({
  properties, labels, briefs, scenariosPerProperty, breakdownByProperty,
}: PropertyGridProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {properties.map((prop) => {
        const isOpen = open === prop;
        return (
          <button
            key={prop}
            onClick={() => setOpen(isOpen ? null : prop)}
            style={{
              backgroundColor: "var(--surface)", border: `1px solid ${isOpen ? "var(--primary-b)" : "var(--border)"}`,
              borderRadius: "10px", padding: "18px", textAlign: "left", cursor: "pointer",
              font: "inherit", color: "inherit", transition: "border-color 0.18s ease",
            }}
            aria-expanded={isOpen}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                {labels[prop] ?? prop}
              </span>
              <span style={{ color: "var(--subtle)", fontSize: "13px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s ease" }} aria-hidden>
                ▾
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)" }}>
              <span>{scenariosPerProperty} scenarios</span>
              <span style={{ color: breakdownByProperty[prop] > 0 ? "var(--danger)" : "var(--subtle)", fontWeight: 600 }}>
                {breakdownByProperty[prop]} verified break{breakdownByProperty[prop] === 1 ? "" : "s"}
              </span>
            </div>
            <div
              style={{
                maxHeight: isOpen ? "160px" : "0px", overflow: "hidden",
                transition: "max-height 0.25s ease, margin-top 0.25s ease",
                marginTop: isOpen ? "12px" : "0px",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6", margin: 0, paddingTop: "12px", borderTop: "1px solid var(--border-2)" }}>
                {briefs[prop]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
