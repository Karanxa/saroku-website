import { NextRequest, NextResponse } from "next/server";
import { challengeStore } from "@/lib/challenge/store";
import { checkPingRateLimit } from "@/lib/challenge/ratelimit";
import type { PingRequest } from "@/lib/challenge/types";

function isValidPingRequest(body: unknown): body is PingRequest {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.instance_id === "string" &&
    b.instance_id.length > 0 &&
    typeof b.scenario_id === "string" &&
    b.scenario_id.length > 0 &&
    typeof b.property === "string" &&
    typeof b.timestamp === "string" &&
    typeof b.claim_token === "string" &&
    b.claim_token.length > 0
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPingRequest(body)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { allowed } = await checkPingRateLimit(body.instance_id);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Per proposal Section 4.2: validate the instance_id corresponds to a
  // real prior check-in. This ping does NOT itself grant any credit — it is
  // logged purely as an early-warning signal and as the anchor claim-token
  // record that /verify will later look up.
  const checkin = await challengeStore.getCheckin(body.instance_id);
  if (!checkin) {
    return NextResponse.json({ error: "unknown_instance" }, { status: 404 });
  }

  await challengeStore.savePing({
    ...body,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ acknowledged: true });
}
