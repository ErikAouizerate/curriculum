import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { error } from "@sveltejs/kit";
import {
  OPENCODE_API_KEY,
  OPENCODE_BASE_URL,
  OPENCODE_MODEL,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "$app/env/private";

import {
  EventFilter,
  MAX_INPUT_LENGTH,
  parseModelLine,
  splitLines,
  type AskEvent,
} from "#lib/ask/events.js";
import { systemPrompt } from "#lib/ask/prompt.js";
import { encodeCv } from "#lib/cv-codec.js";
import type { RequestHandler } from "./$types";

export const prerender = false;

// Hidden reasoning tokens count against this cap; at 900 the answer was cut before the skill lines.
const MAX_OUTPUT_TOKENS = 2500;
const USER_AGENT = "erik-aouizerate-portfolio/1.0";

type Limiters = readonly [Ratelimit, Ratelimit, Ratelimit];
let limiters: Limiters | undefined;

// Created on the first request, never at import: the build imports this module to analyse
// routes, and Vercel only exposes the real values of sensitive variables at runtime.
function getLimiters(): Limiters {
  if (!limiters) {
    const redis = new Redis({ url: UPSTASH_REDIS_REST_URL!, token: UPSTASH_REDIS_REST_TOKEN! });
    // Per visitor and site-wide caps. The global cap keeps the widget under the model allowance.
    limiters = [
      new Ratelimit({ redis, prefix: "ask:ip:min", limiter: Ratelimit.slidingWindow(5, "1 m") }),
      new Ratelimit({ redis, prefix: "ask:ip:day", limiter: Ratelimit.slidingWindow(20, "1 d") }),
      new Ratelimit({ redis, prefix: "ask:global", limiter: Ratelimit.fixedWindow(200, "1 d") }),
    ];
  }
  return limiters;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function withinLimits(ip: string): Promise<boolean> {
  const [perMinute, perDay, global] = getLimiters();
  // Visitor limits first, so a blocked visitor does not consume the global budget.
  if (!(await perMinute.limit(ip)).success) return false;
  if (!(await perDay.limit(ip)).success) return false;
  return (await global.limit("all")).success;
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

export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
  if (
    !OPENCODE_API_KEY ||
    !TURNSTILE_SECRET_KEY ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN
  ) {
    error(503, "Assistant indisponible");
  }
  if (request.headers.get("origin") !== url.origin) error(403, "Origine refusée");

  const body = (await request.json().catch(() => null)) as { input?: unknown; token?: unknown } | null;
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const token = typeof body?.token === "string" ? body.token : "";
  if (!input || input.length > MAX_INPUT_LENGTH) error(400, "Message vide ou trop long");

  const ip = getClientAddress();
  if (!token || !(await verifyTurnstile(token, ip))) error(403, "Vérification anti-robot échouée");
  if (!(await withinLimits(ip))) error(429, "Trop de demandes, réessayez plus tard");

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
  if (!upstream.ok || !upstream.body) error(502, "Le modèle n'a pas répondu");
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
