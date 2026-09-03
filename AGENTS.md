# AGENTS.md — curriculum

Personal CV/résumé site, deployed at https://www.erik-aouizerate.me/ via Vercel.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS v3 (see Deviations below)
- zustand for state (see Deviations below)
- pnpm (package manager, enforced)

## Communication

Communication with the user is in French; all code, documentation, and tests are in English.

## Global policies (Basic Memory, project "main")

- memory://main/guidelines/communication-language-convention-agents.md-claude.md
- memory://main/guidelines/docs-maintenance-policy
- memory://main/guidelines/basic-memory-notes-authoring-guide-for-ai-assistants

## Webapp policies (Basic Memory, project "main")

- memory://main/guidelines/pnpm-policy-for-js-ts-projects
- memory://main/guidelines/type-script-by-default-avoid-plain-js

## Deploy

Deployed via **Vercel** (GitHub integration, push to `main`). No Dokploy, no Traefik — the
`infrastructure`/`deployment` Basic Memory policies do **not** apply to this project
(decision: `memory://main/guidelines/curriculum-vercel-deployment-no-dokploy-no-traefik`).

Docker is kept for **optional local development only**:

- `docker-compose.yml` — base service definition (build only, no reverse-proxy labels, no host ports)
- `docker-compose.override.yml` — dev-only additions, auto-merged by `docker compose up` (bind mount, port 3000, `pnpm dev`)
- `.devcontainer/` — VS Code devcontainer matching `docker compose up`

## Deviations from standard policies

Recorded as Basic Memory decisions:

- `memory://main/guidelines/curriculum-stack-exceptions-to-webapp-policies` — Tailwind CSS v3, zustand instead of classic Redux, some legacy plain JS/JSX files (new code must be TypeScript).
- `memory://main/guidelines/curriculum-vercel-deployment-no-dokploy-no-traefik` — Vercel hosting; Dokploy/Traefik deployment policies not applied, Docker kept for local dev only.

## Project structure

- `src/app/` — Next.js App Router pages and components
- `src/data/` — CV content data (jobs, schools, skills...)
- `src/store/` — zustand store

## Commands

- `pnpm install` — install dependencies (respect `pnpm-workspace.yaml` hardening; approve build scripts deliberately with `pnpm approve-builds` / `allowBuilds`)
- `pnpm dev` — dev server
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint
- `docker compose up` — optional containerized dev

## Docs maintenance

`README.md` and this file are committed alongside the code they document; update them whenever architecture or scope changes.
