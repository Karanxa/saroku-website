"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

const tabs = [
  {
    id: "install",
    label: "Install & Run",
    shortLabel: "Install",
    content: [
      {
        description: "Install saroku from PyPI:",
        code: `pip install saroku`,
        language: "bash",
      },
      {
        description: "Set your API key and run against any supported model:",
        code: `export OPENAI_API_KEY=sk-...

# Run all behavioral probes against gpt-4o
saroku run --model gpt-4o

# Run only sycophancy probes
saroku run --model gpt-4o --probes sycophancy

# Run against Anthropic Claude
export ANTHROPIC_API_KEY=sk-ant-...
saroku run --model claude-sonnet-4-6

# Run against Google Gemini via Vertex AI
saroku run --model vertex_ai/gemini-1.5-pro`,
        language: "bash",
      },
    ],
  },
  {
    id: "baseline",
    label: "Save & Compare Baseline",
    shortLabel: "Baselines",
    content: [
      {
        description: "Save a baseline for your current production model:",
        code: `# Run tests and save results as a named baseline
saroku run --model gpt-4o --save-baseline prod-v1`,
        language: "bash",
      },
      {
        description: "After a model update, compare against the saved baseline:",
        code: `# Compare new model run against saved baseline
saroku run --model gpt-4o --compare-baseline prod-v1

# Example output:
# ┌─────────────────────────────────────────────────┐
# │           saroku Behavioral Report               │
# │  Model: gpt-4o        Baseline: prod-v1         │
# ├────────────────────┬────────┬─────────┬─────────┤
# │ Property           │ Score  │Baseline │  Delta  │
# ├────────────────────┼────────┼─────────┼─────────┤
# │ Sycophancy Rate    │ 23.1%  │ 18.4%   │ +4.7% ⚠ │
# │ Honesty Rate       │ 61.2%  │ 68.9%   │ -7.7% ✗ │
# │ Consistency Rate   │ 79.3%  │ 77.1%   │ +2.2% ✓ │
# └────────────────────┴────────┴─────────┴─────────┘`,
        language: "bash",
      },
      {
        description: "Manage your saved baselines:",
        code: `# List all saved baselines
saroku baseline list

# Manually save current run as baseline
saroku baseline save prod-v2

# Compare two baselines directly
saroku baseline compare prod-v1`,
        language: "bash",
      },
    ],
  },
  {
    id: "cicd",
    label: "CI/CD Integration",
    shortLabel: "CI/CD",
    content: [
      {
        description: "Use --fail-on-regression to gate deployments in CI:",
        code: `# Exit code 1 if any property regresses vs. baseline
saroku run --model gpt-4o-mini \\
  --compare-baseline production \\
  --fail-on-regression`,
        language: "bash",
      },
      {
        description: "GitHub Actions workflow example:",
        code: `name: Behavioral Regression Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  saroku:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Run saroku behavioral tests
        run: |
          pip install saroku
          saroku run \\
            --model gpt-4o-mini \\
            --compare-baseline production \\
            --fail-on-regression \\
            --output results.json
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}

      - name: Upload results artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: saroku-results
          path: results.json`,
        language: "yaml",
      },
    ],
  },
];

export default function QuickStartTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Tab bar */}
      <div
        className="qs-tab-bar"
        style={{
          display: "flex",
          gap: "4px",
          backgroundColor: "var(--surface-3)",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="qs-tab-btn"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "7px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.15s",
              backgroundColor: activeTab === tab.id ? "var(--surface)" : "transparent",
              color: activeTab === tab.id ? "var(--text)" : "var(--muted)",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              fontFamily: "var(--font-inter), sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="qs-label-long">{tab.label}</span>
            <span className="qs-label-short">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content — key triggers re-mount + CSS fade animation */}
      <div key={activeTab} className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {active.content.map((block, i) => (
          <div key={i}>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "10px", marginTop: 0 }}>
              {block.description}
            </p>
            <CodeBlock code={block.code} language={block.language} />
          </div>
        ))}
      </div>

      <style>{`
        .qs-label-short { display: none; }
        @media (max-width: 540px) {
          .qs-label-long  { display: none; }
          .qs-label-short { display: inline; }
          .qs-tab-btn     { font-size: 13px; padding: 8px 6px; }
        }
      `}</style>
    </div>
  );
}
