// Rate limiting for the "Break Saroku" challenge endpoints.
// Values per proposal Section 12, decision 5:
//   checkin: 5 / IP / hour
//   ping:    20 / instance / hour
//   verify:  10 / instance / day
//
// NOTE: backed by the same in-memory ChallengeStore counters, so it shares
// its single-instance limitation (see store.ts doc comment) — fine for
// local verification and a low-traffic launch, not safe to assume correct
// under Cloud Run multi-instance autoscaling. A production rollout should
// move this to a shared counter (Firestore transaction or a small Redis/
// Memorystore instance) alongside the ChallengeStore migration.

import { challengeStore } from "./store";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const RATE_LIMITS = {
  checkinPerIpPerHour: 5,
  pingPerInstancePerHour: 20,
  verifyPerInstancePerDay: 10,
} as const;

export async function checkRateLimit(
  key: string,
  windowMs: number,
  limit: number
): Promise<{ allowed: boolean; count: number }> {
  const count = await challengeStore.incrementAndGetCount(key, windowMs);
  return { allowed: count <= limit, count };
}

export async function checkCheckinRateLimit(ip: string) {
  return checkRateLimit(`checkin:${ip}`, HOUR_MS, RATE_LIMITS.checkinPerIpPerHour);
}

export async function checkPingRateLimit(instanceId: string) {
  return checkRateLimit(`ping:${instanceId}`, HOUR_MS, RATE_LIMITS.pingPerInstancePerHour);
}

export async function checkVerifyRateLimit(instanceId: string) {
  return checkRateLimit(`verify:${instanceId}`, DAY_MS, RATE_LIMITS.verifyPerInstancePerDay);
}
