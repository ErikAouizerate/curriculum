import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { json } from "@sveltejs/kit";
import {
  OPENCODE_API_KEY,
  OPENCODE_BASE_URL,
  OPENCODE_MODEL,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "$app/env/private";

import { clientIp, ipKey } from "#lib/ask/client-ip.js";
import {
  EventFilter,
  MAX_INPUT_LENGTH,
  parseModelLine,
  splitLines,
  type AskEvent,
} from "#lib/ask/events.js";
import { systemPrompt } from "#lib/ask/prompt.js";
import { turnstileError, type TurnstilePayload } from "#lib/ask/turnstile.js";
import { encodeCv } from "#lib/cv-codec.js";
import type { RequestHandler } from "./$types";

export const prerender = false;

// Hidden reasoning tokens count against this cap; at 900 the answer was cut before the skill lines.
const MAX_OUTPUT_TOKENS = 2500;
const USER_AGENT = "erik-aouizerate-portfolio/1.0";

interface Limiters {
  preIp: Ratelimit;
  preGlobal: Ratelimit;
  ipMinute: Ratelimit;
  ipDay: Ratelimit;
  global: Ratelimit;
}

/** Verdict of one limiter: allowed, or refused with the delay to advertise. */
type Limit = { ok: true } | { ok: false; retryAfter: number };

let limiters: Limiters | undefined;

// Created on the first request, never at import: the build imports this module to analyse
// routes, and Vercel only exposes the real values of sensitive variables at runtime.
function getLimiters(): Limiters {
  if (!limiters) {
    const redis = new Redis({ url: UPSTASH_REDIS_REST_URL!, token: UPSTASH_REDIS_REST_TOKEN! });
    // `timeout` makes a slow Redis throw instead of holding the function; `check` then fails open.
    const timeout = 1000;
    limiters = {
      // Runs before Turnstile, which cannot protect the calls made to verify a token: it bounds
      // the function invocations and the outbound checks. Looser than the visitor quota below, so
      // it never refuses a visitor the assistant would have accepted.
      preIp: new Ratelimit({
        redis,
        prefix: "ask:pre:ip",
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        timeout,
      }),
      preGlobal: new Ratelimit({
        redis,
        prefix: "ask:pre:all",
        limiter: Ratelimit.slidingWindow(300, "1 m"),
        timeout,
      }),
      // Per visitor and site-wide caps. The global cap keeps the widget under the model allowance.
      ipMinute: new Ratelimit({
        redis,
        prefix: "ask:ip:min",
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        timeout,
      }),
      ipDay: new Ratelimit({
        redis,
        prefix: "ask:ip:day",
        limiter: Ratelimit.slidingWindow(20, "1 d"),
        timeout,
      }),
      global: new Ratelimit({
        redis,
        prefix: "ask:global",
        limiter: Ratelimit.fixedWindow(200, "1 d"),
        timeout,
      }),
    };
  }
  return limiters;
}

async function check(limiter: Ratelimit, identifier: string): Promise<Limit> {
  try {
    const { success, reset } = await limiter.limit(identifier);
    if (success) return { ok: true };
    const seconds = Math.ceil((reset - Date.now()) / 1000);
    return { ok: false, retryAfter: Math.min(86_400, Math.max(1, seconds)) };
  } catch (cause) {
    // Redis unreachable or too slow: serve the visitor instead of taking the assistant down.
    // Turnstile and the quotas below still apply.
    console.error("[ask] rate limiter degraded", cause);
    return { ok: true };
  }
}

async function verifyTurnstile(token: string, ip: string, hostname: string): Promise<boolean> {
  const id = crypto.randomUUID().slice(0, 8);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      console.error(`[ask ${id}] turnstile http ${response.status}`);
      return false;
    }
    const payload = (await response.json()) as TurnstilePayload;
    const refusal = turnstileError(payload, hostname);
    // Logged only: the visitor always gets the same message, so a wrong secret looks like a bot.
    if (refusal) console.error(`[ask ${id}] turnstile ${refusal}`);
    return refusal === null;
  } catch (cause) {
    console.error(`[ask ${id}] turnstile unreachable`, cause);
    return false;
  }
}

/** Refusal with the headers that keep a shared cache from replaying it. */
function deny(status: number, message: string, retryAfter?: number): Response {
  const headers: Record<string, string> = {
    "cache-control": "private, no-store",
    vary: "origin",
  };
  if (retryAfter !== undefined) headers["retry-after"] = String(retryAfter);
  return json({ status, message }, { status, headers });
}

function encode(event: AskEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

/** Extracts the text deltas from an OpenAI-compatible chat completion SSE stream. */
async function* contentDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true });
    const { lines, rest } = splitLines(buffer);
    buffer = rest;
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const delta = (JSON.parse(data) as { choices?: { delta?: { content?: string } }[] })
          .choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Ignore keep-alive or malformed SSE frames.
      }
    }
  }
}

export const POST: RequestHandler = async ({ request, url }) => {
  if (
    !OPENCODE_API_KEY ||
    !TURNSTILE_SECRET_KEY ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN
  ) {
    return deny(503, "Assistant indisponible");
  }
  // Cheapest first: an unwanted origin touches neither Redis nor Cloudflare.
  if (request.headers.get("origin") !== url.origin) return deny(403, "Origine refusée");

  const body = (await request.json().catch(() => null)) as { input?: unknown; token?: unknown } | null;
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const token = typeof body?.token === "string" ? body.token : "";
  if (!input || input.length > MAX_INPUT_LENGTH) return deny(400, "Message vide ou trop long");

  const ip = clientIp(request.headers);
  const key = await ipKey(ip);

  // Before Turnstile, so a flood of junk tokens still costs neither an invocation storm nor
  // unlimited calls to Cloudflare.
  const [burst, burstGlobal] = await Promise.all([
    check(getLimiters().preIp, key),
    check(getLimiters().preGlobal, "all"),
  ]);
  const refused = burst.ok ? burstGlobal : burst;
  if (!refused.ok) return deny(429, "Trop de demandes, réessayez plus tard", refused.retryAfter);

  if (!token || !(await verifyTurnstile(token, ip, url.hostname))) {
    return deny(403, "Vérification anti-robot échouée");
  }

  // Visitor limits first, so a blocked visitor does not consume the global budget.
  const { ipMinute, ipDay, global } = getLimiters();
  for (const [limiter, identifier] of [
    [ipMinute, key],
    [ipDay, key],
    [global, "all"],
  ] as const) {
    const quota = await check(limiter, identifier);
    if (!quota.ok) return deny(429, "Trop de demandes, réessayez plus tard", quota.retryAfter);
  }

  const upstream = await fetch(`${OPENCODE_BASE_URL.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    signal: request.signal,
    headers: {
      authorization: `Bearer ${OPENCODE_API_KEY}`,
      "content-type": "application/json",
      "user-agent": USER_AGENT,
      "x-opencode-session": crypto.randomUUID(),
    },
    body: JSON.stringify({
      model: OPENCODE_MODEL,
      stream: true,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.2,
      // A matching task needs no hidden reasoning: faster, cheaper, and keeps the budget for output.
      reasoning_effort: "none",
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: input },
      ],
    }),
  });
  if (!upstream.ok || !upstream.body) return deny(502, "Le modèle n'a pas répondu");
  const upstreamBody = upstream.body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const filter = new EventFilter();
      const emit = (line: string) => {
        const event = parseModelLine(line);
        if (event && filter.accept(event)) controller.enqueue(encode(event));
      };

      try {
        let buffer = "";
        for await (const delta of contentDeltas(upstreamBody)) {
          buffer += delta;
          const { lines, rest } = splitLines(buffer);
          buffer = rest;
          lines.forEach(emit);
        }
        if (buffer.trim()) emit(buffer.trim());

        const state = filter.cvState();
        if (state) controller.enqueue(encode({ type: "cv", href: `/studio#cv=${encodeCv(state)}` }));
      } catch {
        controller.enqueue(encode({ type: "error", message: "Réponse interrompue" }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
