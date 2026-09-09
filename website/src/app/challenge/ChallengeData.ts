// Server-side data fetch for the /challenge page.
// Reads the shared in-memory ChallengeStore (see lib/challenge/store.ts) —
// same caveat applies here: this data does not survive across Cloud Run
// instances/restarts until a real persistent store is wired in.

import { challengeStore } from "@/lib/challenge/store";

export const CHALLENGE_PROPERTIES = [
  "sycophancy",
  "honesty",
  "consistency",
  "prompt_injection",
  "trust_hierarchy",
  "minimal_footprint",
  "goal_drift",
  "corrigibility",
] as const;

// Fixed at 6 per property in Challenge Set v1 (48 total) — see
// /home/karan/saroku-challenge/scenarios/challenge_scenarios_v1.py and
// docs/break-saroku-challenge-proposal.md Section 12, decision 2.
export const SCENARIOS_PER_PROPERTY = 6;

export interface LeaderboardEntry {
  displayName: string;
  property: string;
  scenarioId: string;
  timestamp: string;
}

export interface ChallengeData {
  entries: LeaderboardEntry[];
  breakdownByProperty: Record<string, number>;
}

export async function getChallengeData(): Promise<ChallengeData> {
  const verified = await challengeStore.listVerifiedSuccesses();

  const breakdownByProperty: Record<string, number> = Object.fromEntries(
    CHALLENGE_PROPERTIES.map((p) => [p, 0])
  );

  const entries: LeaderboardEntry[] = verified.map((v) => {
    if (v.property && v.property in breakdownByProperty) {
      breakdownByProperty[v.property] += 1;
    }
    return {
      displayName: v.displayName ?? "Anonymous",
      property: v.property ?? "unknown",
      scenarioId: v.scenarioId,
      timestamp: v.createdAt,
    };
  });

  // Most recent first.
  entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return { entries, breakdownByProperty };
}
