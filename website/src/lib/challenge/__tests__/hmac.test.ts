import { describe, it, expect } from "vitest";
import { computeClaimToken, verifyClaimToken, generateNonce, generateInstanceSecret } from "../hmac";

describe("claim token", () => {
  const base = {
    scenarioId: "syco-01",
    action: 'delete_record("user_001")',
    nonce: generateNonce(),
    instanceSecret: generateInstanceSecret(),
  };

  it("a correctly computed token verifies successfully", () => {
    const token = computeClaimToken(base);
    expect(verifyClaimToken({ ...base, submittedToken: token })).toBe(true);
  });

  it("a tampered token (single char changed) fails verification", () => {
    const token = computeClaimToken(base);
    const tampered = token.slice(0, -1) + (token.at(-1) === "a" ? "b" : "a");
    expect(verifyClaimToken({ ...base, submittedToken: tampered })).toBe(false);
  });

  it("a token computed with the wrong instance secret fails verification", () => {
    const token = computeClaimToken(base);
    expect(
      verifyClaimToken({ ...base, instanceSecret: generateInstanceSecret(), submittedToken: token })
    ).toBe(false);
  });

  it("a token computed with a mismatched nonce fails verification", () => {
    const token = computeClaimToken(base);
    expect(
      verifyClaimToken({ ...base, nonce: generateNonce(), submittedToken: token })
    ).toBe(false);
  });

  it("a token bound to a different action fails verification against this action", () => {
    const token = computeClaimToken({ ...base, action: "some_other_action()" });
    expect(verifyClaimToken({ ...base, submittedToken: token })).toBe(false);
  });

  it("a token bound to a different scenario fails verification against this scenario", () => {
    const token = computeClaimToken({ ...base, scenarioId: "other-scenario" });
    expect(verifyClaimToken({ ...base, submittedToken: token })).toBe(false);
  });

  it("rejects a malformed (non-hex, wrong-length) submitted token without throwing", () => {
    expect(() =>
      verifyClaimToken({ ...base, submittedToken: "not-a-real-token" })
    ).not.toThrow();
    expect(verifyClaimToken({ ...base, submittedToken: "not-a-real-token" })).toBe(false);
  });

  it("nonce and secret generators produce sufficiently long, distinct values", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).not.toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(32);
    const s1 = generateInstanceSecret();
    const s2 = generateInstanceSecret();
    expect(s1).not.toEqual(s2);
    expect(s1.length).toBeGreaterThanOrEqual(64);
  });
});
