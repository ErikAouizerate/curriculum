import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: {
    public: true,
    static: true,
    // Optional: undefined keeps the Cloudflare beacon out of the build.
    schema: (value) => value,
  },

  // Portfolio assistant (/api/ask). All optional: without them the endpoint answers 503.
  PUBLIC_TURNSTILE_SITE_KEY: {
    public: true,
    static: true,
    schema: (value) => value,
    description: "Cloudflare Turnstile site key rendered by the portfolio prompt.",
  },
  TURNSTILE_SECRET_KEY: {
    schema: (value) => value,
    description: "Cloudflare Turnstile secret, verified before any model call.",
  },
  OPENCODE_API_KEY: {
    schema: (value) => value,
    description: "OpenCode Console API key (Go subscription or Zen credits).",
  },
  OPENCODE_BASE_URL: {
    schema: (value) => value || "https://opencode.ai/inference/go",
    description: "OpenAI-compatible base URL; switch to the Zen URL without code changes.",
  },
  OPENCODE_MODEL: {
    schema: (value) => value || "claude-haiku-5-5",
    description: "Model ID served by OPENCODE_BASE_URL.",
  },
  UPSTASH_REDIS_REST_URL: {
    schema: (value) => value,
    description: "Upstash Redis REST URL used by the rate limiter.",
  },
  UPSTASH_REDIS_REST_TOKEN: {
    schema: (value) => value,
    description: "Upstash Redis REST token used by the rate limiter.",
  },
});
