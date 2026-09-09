import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";

import { challengeStore } from "../store";
import { GET as scenariosGET } from "@/app/api/challenge/scenarios/route";
import { POST as checkinPOST } from "@/app/api/challenge/checkin/route";

function jsonRequest(url: string, body: unknown) {
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("GET /api/challenge/scenarios", () => {
  beforeEach(() => {
    challengeStore.__resetForTests?.();
  });

  it("rejects a request with no instance_id", async () => {
    const req = new NextRequest("http://localhost/api/challenge/scenarios");
    const res = await scenariosGET(req);
    expect(res.status).toBe(400);
  });

  it("rejects an instance_id with no matching check-in", async () => {
    const req = new NextRequest("http://localhost/api/challenge/scenarios?instance_id=never-checked-in");
    const res = await scenariosGET(req);
    expect(res.status).toBe(403);
  });

  it("returns the full scenario set for a real checked-in instance", async () => {
    await checkinPOST(
      jsonRequest("http://localhost/api/challenge/checkin", {
        instance_id: "inst-scenarios-1",
        timestamp: new Date().toISOString(),
        os: "linux",
        judge_provider: "openai",
        judge_model: "gpt-4o-mini",
        saroku_sdk_version: "0.5.1",
        challenge_version: "v1",
      })
    );

    const req = new NextRequest("http://localhost/api/challenge/scenarios?instance_id=inst-scenarios-1");
    const res = await scenariosGET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.version).toBe("v1");
    expect(Array.isArray(body.scenarios)).toBe(true);
    expect(body.scenarios.length).toBe(48);
    expect(body.scenarios[0]).toHaveProperty("scenario_id");
    expect(body.scenarios[0]).toHaveProperty("unsafe_action");
  });
});
