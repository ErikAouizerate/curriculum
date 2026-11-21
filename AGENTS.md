# AGENTS.md — curriculum

Personal CV/résumé site, deployed at https://www.erik-aouizerate.me/ via Vercel.

## Stack

- SvelteKit 3 + Svelte 5 (runes) + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `@tabler/icons-svelte` for UI icons, `dayjs` for dates
- ESLint 10 flat config (`eslint.config.mjs`), Vitest for unit tests
- pnpm (package manager, enforced)
- Static output: every page is prerendered; one serverless endpoint (`/api/ask`); no database; Cloudflare Web Analytics + Turnstile

## Global conventions

Content copied from Basic Memory (project "main", `guidelines/conventions/`).

- **Communication language** — communication with the user is in French; all code, documentation, and tests are in English. (Réf. « Communication Language Convention (AGENTS.md - CLAUDE.md) »)
- **Docs maintenance** — `README.md` and this file are committed alongside the code they document; update them whenever architecture or scope changes. (Réf. « Docs Maintenance Policy »)
- **Superpowers plans & artifacts — specs only, never committed** — only `docs/superpowers/specs/` is versioned. `docs/superpowers/plans/` (implementation plans) and `.superpowers/` (local SDD execution artifacts) are generated per session and are gitignored, never committed. (Réf. « Superpowers Plans & Artifacts — Specs Only, Never Committed »)
- **Basic Memory notes** — the knowledge base (Basic Memory, project "main") is the persistent memory shared between the user and code assistants; whenever an instruction says "note", it means a Basic Memory note written through the MCP tools. Search before writing (`search_notes`); agents create `raw`/`candidate` notes and must not promote, rewrite, or delete `canonical` notes without explicit authorization — supersede, never silently delete. Notes are autonomous: never reference external vaults or file paths. Before an architectural choice, search `guidelines/` for an existing decision. (Réf. « Basic Memory Notes — Authoring Guide for AI Assistants »)
- **Code research** — structural code research goes through the codebase-memory-mcp knowledge graph, not ad-hoc grep/glob: `search_graph`, `trace_path`, `get_code_snippet`, `get_architecture`, `query_graph`, `check_index_coverage`, and `list_projects`/`index_status` at session start. grep/glob remain fallbacks for string literals, error messages, config values, non-code files, or insufficient coverage. This binds superpowers skills too. (Réf. « Code Research — Codebase Memory MCP »)

## Webapp conventions

Content copied from Basic Memory (project "main", `guidelines/stack/`); exceptions in Deviations.

- **pnpm** — all JS/TS projects must use pnpm; never npm or yarn (no `package-lock.json`, no `yarn.lock`). `pnpm-workspace.yaml` carries the supply-chain hardening (`minimumReleaseAge`, `minimumReleaseAgeStrict`, `blockExoticSubdeps`, `strictDepBuilds`); approve build scripts deliberately with `pnpm approve-builds` / `allowBuilds`. A direct consequence: "latest" means "latest version older than 7 days"; `pnpm install` fails rather than silently picking a newer release. (Réf. « pnpm Policy for JS-TS Projects »)
- **TypeScript by default** — write everything in TypeScript; plain JS only where the toolchain requires it (config files, the PDF script). (Réf. « TypeScript by Default — Avoid Plain JS »)

## Rendering invariants

These rules are what keep the CV fast and statically deployable.

- **`/` must not ship the application runtime.** `src/routes/+page.js` exports `csr = dev`
  (`false` in every build; `true` under `pnpm dev` only, because a `csr = false` page receives no
  Vite client and would never hot-reload); never
  add a `client:*` directive or an interactive Svelte component to the public page. The only
  allowed scripts are `static/cv.js` (share/print delegation), the Cloudflare beacon rendered by
  `src/routes/+layout.svelte` from `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`, and the inert
  `Person` JSON-LD block. Verify that `index.html`
  does not reference `_app/immutable/nodes`; CI enforces it. `/studio` prerenders the CV header
  (`CvDocument showContent={false}`): it does not depend on the fragment, so it paints at once and
  takes part in the view transition; the content appears once `#cv=` is decoded. (A
  `rel="expect"` render hold cannot wait for a client-rendered element: it releases at the end of
  parsing.)
- **Cross-page motion is CSS only.** `/` ↔ `/portfolio` ↔ `/studio` (full page loads) animate with
  cross-document view transitions (`@view-transition` in `src/app.css`). The names `cv-banner`,
  `cv-avatar`, `cv-title`, `cv-name` and `nav-arrow` (one left-arrow icon everywhere; the one on `/` is rotated
  180deg on the element, so the morph interpolates the half-turn) must
  stay unique per page; never add JS to drive this animation. Links between these pages carry
  `data-sveltekit-reload` so dev (hydrated) also does full page loads and plays the transition.
- **`src/lib/components/` stays presentational.** No browser API, no `$app/*` import, no editor
  state. Components receive a `CvView` and optional callbacks, so the same code renders the static
  CV and the editor.
- **Icons are imported by subpath.** The `@tabler/icons-svelte` root barrel re-exports more than
  6 000 components; importing from `"@tabler/icons-svelte"` makes Vite compile all of them on the
  first request in dev (measured: ~15 s against ~1 s). Always use
  `import IconMail from "@tabler/icons-svelte/icons/mail"`.
- **State lives in the URL fragment.** `/studio` reads and writes `#cv=<24 chars>`. Actions push a
  history entry, so the browser Back button is the undo. Do not add a second source of truth.
- **The codec is versioned.** Changing the job or skill catalog order/size changes the bit layout:
  bump `CODEC_VERSION` and let old links fall back to the default CV.
- **Agent discovery is part of the public surface.** `static/llms.txt`, `static/robots.txt`,
  `static/sitemap.xml` and the prerendered `src/routes/llms-full.txt/+server.ts` are shipped on
  purpose. `llms-full.txt` is generated from `src/lib/content/`; never hand-edit it. `robots.txt`
  currently sets `Content-Signal: search=yes, ai-input=yes, ai-train=no` and excludes `/studio`.
- **Content is separate from presentation.** Editorial changes go in `src/lib/content/`; dates are
  `YYYY-MM`, and job tools reference `labels` so typos fail `pnpm test`.
- **Images stay optimized.** `static/icons/` contains only referenced assets, as SVG or 64×64
  WebP; the avatar is a 224×224 WebP. `content.test.ts` rejects other raster formats and icon
  files over 10 KiB, so never point content at the original PNG/JPEG sources.
- **The Person JSON-LD belongs to `/` only.** `src/routes/+page.svelte` generates it from
  `src/lib/content/`; keep it consistent with the visible CV and never add it to `/studio`.

## Deploy

Production is deployed by **GitHub Actions** (`.github/workflows/build-and-deploy.yml`), not by the
Vercel Git integration.

- Pull requests run install, check, lint, test, build and produce the PDF artifact; they never
  deploy.
- Pushes to `main` run `vercel pull`, `vercel build --prod`, generate the PDF into
  `.vercel/output/static`, compress it with Ghostscript, then `vercel deploy --prebuilt --prod`.
- Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Optional repository variable:
  `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` (injected into the build; omit it to disable analytics). The Vercel project must
  use the SvelteKit framework preset and the `pnpm build` build command.
- Every route is prerendered; the adapter still emits a catch-all function used only for unknown
  paths and error rendering, never for `/` or `/studio`.
- `vercel.json` sets `ignoreCommand: "exit 0"`, so Vercel skips every Git-triggered build
  (`0` = skip, `1` = build) and only the GitHub Action deploys. The Git integration can stay
  connected.
- Baseline security headers (`nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options: DENY`) are declared in `vercel.json` for every path. Vercel applies them at
  deploy time; verify them on a preview deployment with `curl -I`, not with `vite preview`.
- **Production access** — never perform direct actions on production (no `bash`, `docker`, `ssh`,
  restarts, deployments, or data changes). Hand the exact commands to the user, explain why, and
  wait for their output before continuing. **Exception:** `git commit` and `git push` on this
  repository are allowed when the user asks — the push to `main` is the sanctioned deployment path
  (GitHub Actions → Vercel). (Réf. « Production Access — No Agent Actions, Only Commands for the
  User »)

Docker is kept for **optional local development only**, and the dev server is forced to port 3000
so the shared Caddy proxy keeps serving `http://curriculum.localhost`:

- `docker-compose.yml` — base service definition (build only, no host ports, no reverse-proxy labels)
- `docker-compose.override.yml` — dev-only additions, auto-merged by `docker compose up` (bind
  mount, `pnpm dev`, local Caddy proxy labels)

## Deviations from standard policies

Recorded as Basic Memory decisions (`guidelines/curriculum/`).

- **SvelteKit static instead of the Vite/React webapp stack** — the public CV must ship zero
  JavaScript and the site must be deployable as static files. SvelteKit gives a per-page
  `csr = false` MPA plus app-style routing/state for the future interactive modules.
- **Cloudflare only for third-party scripts** — Umami was removed; the third-party scripts are the
  Cloudflare beacon configured in `src/app.html` and, on `/portfolio` only, Cloudflare Turnstile.
- **Vercel via GitHub Actions** — the Dokploy/Traefik infrastructure and Docker-Compose/Dokploy
  deployment policies do not apply; Docker is for local development only. The Vercel Git
  integration is disabled in favour of `vercel --prebuilt` from CI, so the build-time PDF is part
  of the deployment.
- **State in the URL, one stateless endpoint** — there is no database; the CV selection is encoded
  in the fragment and never sent to a server. The only backend is `POST /api/ask` (portfolio
  assistant): Upstash Redis holds rate-limit counters only, and visitor prompts are never stored.
- **Portfolio assistant on OpenCode Go** — accepted risk: OpenCode's terms describe Go as for
  internal coding-agent use. The base URL/key are env vars so switching to OpenCode Zen
  (pay-as-you-go, same models) needs no code change. Its global cap shares the Go allowance.

## Project structure

- `src/routes/` — `/` (static CV), `/portfolio` (assistant), `/studio` (editor), `api/ask` (assistant endpoint)
- `src/lib/ask/` — assistant system prompt, event validation and tailored-CV state (pure, tested)
- `src/lib/content/` — editorial data (jobs, skills, schools, labels, profile)
- `src/lib/components/` — presentational CV components
- `src/lib/cv.ts` — default state, view model, pure transitions
- `src/lib/cv-codec.ts` / `cv-hash.ts` — state encoding and fragment access
- `scripts/pdf.mjs` — static server + Playwright PDF generation
- `docs/superpowers/specs/` — versioned design specs
- `docs/assets/` — large design assets kept out of the deployed site

## Commands

- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install` — install dependencies (respect
  `pnpm-workspace.yaml`; approve build scripts deliberately with `pnpm approve-builds` /
  `allowBuilds`)
- `pnpm dev` — dev server on http://localhost:3000
- `pnpm build` — static build into `.vercel/output/static`
- `pnpm preview` — preview the production build
- `pnpm check` — Svelte and TypeScript diagnostics
- `pnpm lint` — ESLint
- `pnpm test` — Vitest
- `pnpm pdf` — generate `Erik_Aouizerate_CV.pdf` from the build
- `bash scripts/compress-pdf.sh <pdf>` — compress a PDF with Ghostscript
- `docker compose up` — optional containerized dev, served at http://curriculum.localhost
