/**
 * Cloudflare Turnstile verdict. The widget is rendered with `action: "ask"`, so a token solved
 * for another purpose is refused. The hostname is the one the page was served from, which covers
 * production, previews and localhost without a separate allowlist.
 */

export const TURNSTILE_ACTION = "ask";
/** Turnstile tokens are valid for 300 seconds; older ones are refused. */
export const TURNSTILE_MAX_AGE_MS = 300_000;

export interface TurnstilePayload {
  success?: boolean;
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
}

/**
 * Why a solved token is refused, or `null` when it is accepted. The reason is only logged: the
 * visitor always gets the same message, so a wrong secret cannot be told apart from a bot.
 */
export function turnstileError(
  payload: TurnstilePayload,
  hostname: string,
  now: number = Date.now(),
): string | null {
  if (payload.success !== true) {
    return `rejected[${(payload["error-codes"] ?? []).join(",")}]`;
  }
  if (payload.action !== TURNSTILE_ACTION) return `action:${payload.action}`;
  if ((payload.hostname ?? "").toLowerCase() !== hostname.toLowerCase()) {
    return `hostname:${payload.hostname}`;
  }
  const solvedAt = Date.parse(payload.challenge_ts ?? "");
  if (!Number.isFinite(solvedAt) || now - solvedAt > TURNSTILE_MAX_AGE_MS) {
    return `stale:${payload.challenge_ts}`;
  }
  return null;
}
