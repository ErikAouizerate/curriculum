# curriculum

Personal CV/résumé site — SvelteKit 3 + Svelte 5 + TypeScript + Tailwind CSS v4, deployed at
[erik-aouizerate.me](https://www.erik-aouizerate.me/).

## Architecture

- `/` — the public CV. Prerendered at build with `csr = false`: **no framework JavaScript is
  served**. Content is complete in `index.html`; only `static/cv.js` (share/print delegation) and
  the Cloudflare beacon run on the page. The only other script tag is the inert `Person` JSON-LD.
  A top-right arrow links to `/portfolio`, whose header holds a back arrow to `/`.
- `/portfolio` — hydrated page (`noindex`) hosting the **portfolio assistant**: a visitor pastes a
  job description, asks a question or lists keywords; `POST /api/ask` streams NDJSON events
  (sentences, matched skills, relevant jobs, projects from `src/lib/content/projects.ts`: public GitHub repositories plus the client
  projects imported from the previous portfolio, with thumbnails in `static/projects/`; client projects open their full
  presentation, `*-full.webp`, in a native `<dialog>`)
  and ends with a tailored-CV link `/studio#cv=…` built with the existing codec. The prompt is
  always on the left 3/5 (from `lg`); the CV in the right 2/5 is scaled with CSS `zoom` to fit; the right column shows the animated hero of the previous portfolio (`Scramble.svelte`), then the tailored CV
  (`CvDocument`), which grows live as skills and
  jobs stream in (its `view-transition-name`s are neutralised so the page transitions keep working). Every model line
  is validated against the catalog (`src/lib/ask/events.ts`), so unknown skills or projects
  never reach the page. The last prompt and answer are kept in `sessionStorage`
  (per tab, best effort), so returning from `/studio` restores them. Navigating from `/` uses a
  cross-document view transition (pure CSS in `src/app.css`): the avatar, title and name share
  `view-transition-name`s (`cv-banner`, `cv-avatar`, `cv-title`, `cv-name`) with `CvHeader`: the
  first banner becomes the nav bar and the rest morphs into the top-left heading while the rest of the page fades in. Unsupported browsers and
  `prefers-reduced-motion: reduce` get a plain navigation.
- `/studio` — the interactive editor (filters, collapsed jobs, undo). Hydrated on demand; its
  state lives entirely in the URL fragment as `#cv=<24 base64url characters>`. Like `/`, the CV is
  centred and the toolbars sit just right of it on wide screens; its left arrow returns to `/portfolio`. The CV header is prerendered so it paints at
  once (and morphs from `/portfolio`); skills and jobs appear once the fragment is decoded.
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

## Agent discovery

The site exposes machine-readable entry points for search engines and AI agents:

- `/llms.txt` — a Markdown map of the canonical CV resources.
- `/llms-full.txt` — the full public CV in Markdown, generated at build from
  `src/lib/content/` (never hand-edited).
- `/sitemap.xml` — the canonical page URL.
- `/robots.txt` — allows search and AI input, disallows model training
  (`Content-Signal: search=yes, ai-input=yes, ai-train=no`) and excludes `/studio`.
- The HTML head declares both files with `rel="describedby"` and
  `rel="alternate" type="text/markdown"`.

## Images, structured data and security headers

- `static/icons/` only holds assets referenced by the content, as SVG or 64×64 WebP; the avatar is
  a 224×224 WebP. `content.test.ts` rejects other raster formats and files over 10 KiB.
- `/` embeds a schema.org `Person` JSON-LD block generated in `src/routes/+page.svelte` from
  `src/lib/content/` (identity, contacts, schools and a balanced selection of default skills).
  `/studio` deliberately has none.
- `vercel.json` sets `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and
  `X-Frame-Options` for every path. Vercel applies these headers during `vercel build`/deploy;
  `vite preview` does not, so check them on a preview deployment with `curl -I`.

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

Every page is prerendered. `@sveltejs/adapter-vercel` emits a catch-all function for unknown
paths and error rendering, and one function for `/api/ask`.

The assistant endpoint checks, in order: same `Origin`, input length (≤ 10 000 chars), a Cloudflare
Turnstile token, then Upstash rate limits (5/min and 20/day per IP, 200/day site-wide), before
calling an OpenAI-compatible `chat/completions` stream (`max_tokens` 2500, `reasoning_effort: "none"`). Server variables, all
optional (without them the endpoint answers 503): `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`
(default `https://opencode.ai/inference/go`), `OPENCODE_MODEL` (default `claude-haiku-5-5`),
`TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`; build variable
`PUBLIC_TURNSTILE_SITE_KEY`. Set them in the Vercel project (`vercel pull` brings them to CI).
Cloudflare's always-pass test keys (`1x00000000000000000000AA` /
`1x0000000000000000000000000000000AA`) work locally.

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
