import { describe, expect, it } from "vitest";

import { TURNSTILE_ACTION, turnstileError } from "#lib/ask/turnstile.js";

const HOSTNAME = "www.erik-aouizerate.me";
const now = Date.parse("2026-11-21T12:00:00.000Z");
const solved = (overrides: Record<string, unknown> = {}) => ({
  success: true,
  action: TURNSTILE_ACTION,
  hostname: HOSTNAME,
  challenge_ts: "2026-11-21T11:59:00.000Z",
  ...overrides,
});

describe("turnstileError", () => {
  it("accepts a fresh token solved for this action and host", () => {
    expect(turnstileError(solved(), HOSTNAME, now)).toBeNull();
    expect(turnstileError(solved({ hostname: HOSTNAME.toUpperCase() }), HOSTNAME, now)).toBeNull();
  });

  it("refuses a failed challenge", () => {
    expect(turnstileError(solved({ success: false }), HOSTNAME, now)).toContain("rejected");
  });

  it("refuses a token solved for another action", () => {
    expect(turnstileError(solved({ action: "login" }), HOSTNAME, now)).toBe(
      "action:login",
    );
  });

  it("refuses a token solved for another host", () => {
    expect(turnstileError(solved({ hostname: "evil.example" }), HOSTNAME, now)).toBe(
      "hostname:evil.example",
    );
  });

  it("refuses an expired or missing timestamp", () => {
    expect(turnstileError(solved({ challenge_ts: "2026-11-21T11:50:00.000Z" }), HOSTNAME, now)).toContain(
      "stale",
    );
    expect(turnstileError(solved({ challenge_ts: undefined }), HOSTNAME, now)).toContain("stale");
  });
});
