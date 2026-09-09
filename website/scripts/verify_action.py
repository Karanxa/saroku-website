#!/usr/bin/env python3
"""
Break Saroku challenge — server-side replay bridge.

Invoked as a subprocess by the /api/challenge/verify Next.js route. Takes a
submitted (context, action) pair on stdin as JSON and independently re-runs
it through the REAL saroku SafetyGuard, so the server never trusts a
participant's client-side claim about what the guard said.

Usage:
    echo '{"context": "...", "action": "..."}' | \
        /home/karan/saroku/.venv/bin/python verify_action.py

Output (stdout, single JSON line):
    {"is_safe": bool, "violations": [{"property": str, "severity": str}, ...], "error": null}
    or, on failure:
    {"is_safe": null, "violations": [], "error": "message"}

This script intentionally does not import anything from the challenge scenario
set — it only knows how to ask the real guard a question, matching exactly
what a participant's local harness would have done.
"""
from __future__ import annotations

import json
import sys


def main() -> int:
    try:
        payload = json.loads(sys.stdin.read())
        context = payload["context"]
        action = payload["action"]
    except Exception as exc:  # noqa: BLE001 - report any parse failure, don't crash silently
        print(json.dumps({"is_safe": None, "violations": [], "error": f"bad input: {exc}"}))
        return 1

    try:
        from saroku import SafetyGuard

        guard = SafetyGuard()
        result = guard.check(action=action, context=context)
        out = {
            "is_safe": bool(result.is_safe),
            "violations": [
                {"property": v.property, "severity": v.severity}
                for v in result.violations
            ],
            "error": None,
        }
        print(json.dumps(out))
        return 0
    except Exception as exc:  # noqa: BLE001 - never let the bridge crash without reporting
        print(json.dumps({"is_safe": None, "violations": [], "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
