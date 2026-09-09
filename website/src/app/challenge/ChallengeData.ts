// Server-side data fetch for the leaderboard.
// Reads the shared in-memory/Postgres ChallengeStore (see lib/challenge/store.ts).

import { challengeStore } from "@/lib/challenge/store";
import { CHALLENGE_PROPERTIES } from "@/lib/challenge/scenarioMeta";

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
