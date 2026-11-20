# curriculum

Personal CV/résumé site — SvelteKit 3 + Svelte 5 + TypeScript + Tailwind CSS v4, deployed at
[erik-aouizerate.me](https://www.erik-aouizerate.me/).

## Architecture

- `/` — the public CV. Prerendered at build with `csr = false`: **no framework JavaScript is
  served**. Content is complete in `index.html`; only `static/cv.js` (share/print delegation) and
  the Cloudflare beacon run on the page. The top-right arrow to `/studio` is currently visually
  hidden (opacity 0) but keeps a 56×56 clickable area; it appears on keyboard focus.
- `/studio` — the interactive editor (filters, collapsed jobs, undo). Hydrated on demand; its
  state lives entirely in the URL fragment as `#cv=<24 base64url characters>`.
- `src/lib/content/` — typed editorial content (jobs, skills, schools, labels, profile).
- `src/lib/components/` — presentational Svelte components, no browser API, no state.
- `src/lib/cv.ts` — default state, view model, pure state transitions.
- `src/lib/cv-codec.ts` — versioned bit-field codec for the URL state.
- `scripts/pdf.mjs` — serves the static build and prints `/` to A4 with Playwright.

See [docs/superpowers/specs/2026-11-20-sveltekit-static-cv.md](docs/superpowers/specs/2026-11-20-sveltekit-static-cv.md)
for the design decisions and verification criteria.

## Getting started

This project uses **pnpm** (see `pnpm-workspace.yaml` for the supply-chain hardening settings).

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The editor is at
[http://localhost:3000/studio](http://localhost:3000/studio).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Vite dev server on port 3000 |
| `pnpm build` | Static build into `.vercel/output/static` |
| `pnpm preview` | Preview the build |
| `pnpm check` | Svelte + TypeScript diagnostics |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (codec, view model, content validation) |
| `pnpm pdf` | Build output → `Erik_Aouizerate_CV.pdf` (needs Chromium) |
| `bash scripts/compress-pdf.sh <pdf>` | Compress a PDF with Ghostscript |

`pnpm pdf` uses Playwright. Install the browser once with
`pnpm exec playwright install chromium`, or use an existing Chrome with
`PLAYWRIGHT_CHANNEL=chrome pnpm pdf`.

## Content and state

Content lives in TypeScript modules under `src/lib/content/`; dates use `YYYY-MM`. Job tools
reference the canonical `labels` dictionary. Adding or removing skills or jobs changes the codec
capacity: bump `CODEC_VERSION` in `src/lib/cv-codec.ts` so older shared links fall back to the
default CV instead of decoding a wrong selection.

The codec holds:

| Field | Bits |
| --- | --- |
| Version | 4 |
| Jobs (hidden / complete / small) | 2 × 14 |
| Skills | 1 × 75 |
| Total | 107 of 144 |

## Deployment

Production is deployed by GitHub Actions (`.github/workflows/build-and-deploy.yml`):

1. pull request: install, check, lint, test, build, PDF artifact;
2. push to `main`: the same, then `vercel pull`, `vercel build --prod`, PDF generation,
   Ghostscript compression and `vercel deploy --prebuilt --prod`.

Git-triggered Vercel builds are skipped by `ignoreCommand: "exit 0"` in `vercel.json` (Vercel's
convention is inverted: `0` skips, `1` builds), so only the GitHub Action deploys. The Git
integration can stay connected. Required repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`. Optional repository variable: `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` for the analytics beacon. In the Vercel project
settings, use the **SvelteKit** framework preset and the `pnpm build` build command; `vercel build`
runs it again before the PDF is added to `.vercel/output/static`.

Every route is prerendered. `@sveltejs/adapter-vercel` still emits a catch-all function for unknown
paths and error rendering; it is never used for `/` or `/studio`.

The PDF is compressed with Ghostscript (`/ebook`, 150 dpi images) before the artifact upload and the
deployment.

Cloudflare Web Analytics is injected at build time by `src/routes/+layout.svelte` from
`PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`. Locally, put it in `.env` (gitignored, see `.env.example`); in
CI, it comes from the GitHub Actions secret of the same name. Without it, the beacon is omitted.

Docker is for optional local development only (`docker compose up`, served at
[http://curriculum.localhost](http://curriculum.localhost)).

## Conventions

See [AGENTS.md](./AGENTS.md) — stack policies, package manager rules, rendering invariants and
deployment constraints.
