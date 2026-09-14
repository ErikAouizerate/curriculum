# AGENTS.md — curriculum

Personal CV/résumé site, deployed at https://www.erik-aouizerate.me/ via Vercel.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS v3 (see Deviations below)
- zustand for state (see Deviations below)
- pnpm (package manager, enforced)

## Global conventions

Content copied from Basic Memory (project "main", `guidelines/conventions/`).

- **Communication language** — communication with the user is in French; all code, documentation, and tests are in English. (Réf. « Communication Language Convention (AGENTS.md - CLAUDE.md) »)
- **Docs maintenance** — `README.md` and this file are committed alongside the code they document; update them whenever architecture or scope changes. (Réf. « Docs Maintenance Policy »)
- **Superpowers plans & artifacts — specs only, never committed** — only `docs/superpowers/specs/` is versioned. `docs/superpowers/plans/` (implementation plans) and `.superpowers/` (local SDD execution artifacts) are generated per session and are gitignored, never committed. (Réf. « Superpowers Plans & Artifacts — Specs Only, Never Committed »)
- **Basic Memory notes** — the knowledge base (Basic Memory, project "main") is the persistent memory shared between the user and code assistants; whenever an instruction says "note", it means a Basic Memory note written through the MCP tools. Search before writing (`search_notes`); agents create `raw`/`candidate` notes and must not promote, rewrite, or delete `canonical` notes without explicit authorization — supersede, never silently delete. Notes are autonomous: never reference external vaults or file paths. Before an architectural choice, search `guidelines/` for an existing decision. (Réf. « Basic Memory Notes — Authoring Guide for AI Assistants »)
- **Code research** — structural code research goes through the codebase-memory-mcp knowledge graph, not ad-hoc grep/glob: `search_graph`, `trace_path`, `get_code_snippet`, `get_architecture`, `query_graph`, `check_index_coverage`, and `list_projects`/`index_status` at session start. grep/glob remain fallbacks for string literals, error messages, config values, non-code files, or insufficient coverage. This binds superpowers skills too. (Réf. « Code Research — Codebase Memory MCP »)

## Webapp conventions

Content copied from Basic Memory (project "main", `guidelines/stack/`); exceptions in Deviations.

- **pnpm** — all JS/TS projects must use pnpm; never npm or yarn (no `package-lock.json`, no `yarn.lock`). `pnpm-workspace.yaml` carries the supply-chain hardening (`minimumReleaseAge`, `minimumReleaseAgeStrict`, `blockExoticSubdeps`, `strictDepBuilds`); approve build scripts deliberately with `pnpm approve-builds` / `allowBuilds`. (Réf. « pnpm Policy for JS-TS Projects »)
- **TypeScript by default** — write everything in TypeScript; plain JS only where the toolchain requires it (config files, plus the legacy files listed in Deviations). (Réf. « TypeScript by Default — Avoid Plain JS »)

## Deploy

Deployed via **Vercel** (GitHub integration, push to `main`). There is no Dokploy and no Traefik, and no reverse-proxy labels belong in this repo: the Infrastructure and Docker-Compose/Dokploy deployment policies do not apply here (see Deviations).

- **Production access** — never perform direct actions on production (no `bash`, `docker`, `ssh`, restarts, or data changes). Hand the exact commands to the user, explain why, and wait for their output before continuing. (Réf. « Production Access — No Agent Actions, Only Commands for the User »)

Docker is kept for **optional local development only**:

- `docker-compose.yml` — base service definition (build only, no host ports, no reverse-proxy labels)
- `docker-compose.override.yml` — dev-only additions, auto-merged by `docker compose up` (bind mount, `pnpm dev`, local Caddy proxy labels)

Local HTTP routing goes through the shared caddy-docker-proxy on the external `local-proxy`
network: the dev site is served at `http://curriculum.localhost`. The proxy labels live in the
override, never in the base file.

## Deviations from standard policies

Recorded as Basic Memory decisions (`guidelines/curriculum/`).

- **Stack exceptions** — Tailwind CSS v3 and zustand are kept (the Tailwind v4 + classic-Redux policy targets the Vite webapp stack and does not apply); some legacy plain JS/JSX files remain but all new code must be TypeScript; the pnpm policy applies fully. (Réf. « Curriculum — Stack Exceptions to Webapp Policies »)
- **Vercel deployment** — the Dokploy/Traefik infrastructure and Docker-Compose/Dokploy deployment policies do not apply; Docker is for local development only. (Réf. « Curriculum — Vercel Deployment (No Dokploy, No Traefik) »)

## Project structure

- `src/app/` — Next.js App Router pages and components
- `src/data/` — CV content data (jobs, schools, skills...)
- `src/store/` — zustand store

## Commands

- `pnpm install` — install dependencies (respect `pnpm-workspace.yaml` hardening; approve build scripts deliberately with `pnpm approve-builds` / `allowBuilds`)
- `pnpm dev` — dev server
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint
- `docker compose up` — optional containerized dev, served at http://curriculum.localhost
