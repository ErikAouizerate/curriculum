# CLAUDE.md

Project conventions live in [AGENTS.md](./AGENTS.md); architecture, commands and deployment are
documented in [README.md](./README.md).

Two invariants matter most when editing this repository:

1. `/` is prerendered with `csr = false` and must stay free of the SvelteKit app runtime; only
   `static/cv.js` and the Cloudflare beacon are allowed to run on it.
2. `src/lib/components/` is presentational only; editor state lives in the URL fragment and in
   `src/lib/cv.ts`.

Run `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build` before considering a change complete.
