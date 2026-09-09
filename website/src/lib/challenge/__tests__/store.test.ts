import { describe, it, expect, beforeEach } from "vitest";
import { challengeStore } from "../store";

describe("ChallengeStore.listVerifiedSuccesses", () => {
  beforeEach(() => {
    challengeStore.__resetForTests?.();
  });

  it("returns an empty array when the store is empty", async () => {
    const result = await challengeStore.listVerifiedSuccesses();
    expect(result).toEqual([]);
  });

  it("returns a single verified entry, excluding non-verified statuses", async () => {
    await challengeStore.saveVerification({
      instanceId: "inst-1",
      scenarioId: "csv1-syc-01",
      property: "sycophancy",
      displayName: "alice",
      status: "verified",
      reason: "replay_confirmed",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    await challengeStore.saveVerification({
      instanceId: "inst-2",
      scenarioId: "csv1-hon-01",
      property: "honesty",
      displayName: "bob",
      status: "flagged",
      reason: "no_matching_ping",
      createdAt: "2026-01-01T00:01:00.000Z",
    });
    await challengeStore.saveVerification({
      instanceId: "inst-3",
      scenarioId: "csv1-con-01",
      property: "consistency",
      displayName: "carol",
      status: "rejected",
      reason: "replay_did_not_reproduce_break",
      createdAt: "2026-01-01T00:02:00.000Z",
    });

    const result = await challengeStore.listVerifiedSuccesses();
    expect(result).toHaveLength(1);
    expect(result[0].instanceId).toBe("inst-1");
    expect(result[0].status).toBe("verified");
  });

  it("returns multiple verified entries", async () => {
    await challengeStore.saveVerification({
      instanceId: "inst-1",
      scenarioId: "csv1-syc-01",
      property: "sycophancy",
      displayName: "alice",
      status: "verified",
      reason: "replay_confirmed",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    await challengeStore.saveVerification({
      instanceId: "inst-2",
      scenarioId: "csv1-hon-01",
      property: "honesty",
      displayName: "bob",
      status: "verified",
      reason: "replay_confirmed",
      createdAt: "2026-01-01T00:01:00.000Z",
    });

    const result = await challengeStore.listVerifiedSuccesses();
    expect(result).toHaveLength(2);
  });

  it("preserves a null displayName for anonymous submissions", async () => {
    await challengeStore.saveVerification({
      instanceId: "inst-1",
      scenarioId: "csv1-syc-01",
      property: "sycophancy",
      displayName: null,
      status: "verified",
      reason: "replay_confirmed",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    const result = await challengeStore.listVerifiedSuccesses();
    expect(result[0].displayName).toBeNull();
  });
});
