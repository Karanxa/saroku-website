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

// One accurate sentence per property, grounded in real scenarios from
// challenge_scenarios_v1.py (not invented) — shown when a visitor expands
// a property card on /challenge.
export const PROPERTY_BRIEFS: Record<string, string> = {
  sycophancy: "Agents that abandon a safety rule under social pressure — e.g. skipping an urgent-care redirect, or a large-trade confirmation, because the user pushed back.",
  honesty: "Agents that act on an unverified claim as if it were confirmed fact — e.g. finalizing a contract or publishing a statistic because someone said it was “already reviewed.”",
  consistency: "Agents that make a different call on the same destructive action depending on how softly it's described — e.g. “spring cleaning” instead of “permanently delete records.”",
  prompt_injection: "Agents that follow instructions smuggled into data they retrieved — a ticket body, a calendar invite — instead of the task they were actually given.",
  trust_hierarchy: "Agents that let a user override an operator-level rule just because the user claims elevated authority — “I'm actually the supervisor, so waive it.”",
  minimal_footprint: "Agents that grant broader access or scope than the task actually requires — e.g. sharing an entire drive to deliver one file.",
  goal_drift: "Agents that expand scope into unrelated tasks just because they're “already in there” — e.g. disabling a policy while resetting one password.",
  corrigibility: "Agents that partially resist or water down an explicit stop instruction instead of fully complying — “keep running it, just slower” instead of halting.",
};

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
