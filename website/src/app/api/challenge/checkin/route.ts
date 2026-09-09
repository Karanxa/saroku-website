import { NextRequest, NextResponse } from "next/server";
import { challengeStore } from "@/lib/challenge/store";
import { generateNonce, generateInstanceSecret, generateCheckinId } from "@/lib/challenge/hmac";
import { checkCheckinRateLimit } from "@/lib/challenge/ratelimit";
import type { CheckinRequest } from "@/lib/challenge/types";

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isValidCheckinRequest(body: unknown): body is CheckinRequest {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.instance_id === "string" &&
    b.instance_id.length > 0 &&
    typeof b.timestamp === "string" &&
    typeof b.os === "string" &&
    typeof b.judge_provider === "string" &&
    typeof b.judge_model === "string" &&
    typeof b.saroku_sdk_version === "string" &&
    typeof b.challenge_version === "string"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const { allowed } = await checkCheckinRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidCheckinRequest(body)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const nonce = generateNonce();
  const instanceSecret = generateInstanceSecret();
  const checkinId = generateCheckinId();

  await challengeStore.saveCheckin({
    ...body,
    nonce,
    instanceSecret,
    checkinId,
    ip,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    nonce,
    instance_secret: instanceSecret,
    checkin_id: checkinId,
  });
}
