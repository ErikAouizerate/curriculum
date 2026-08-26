# AGENTS.md — curriculum

Personal CV/résumé site, deployed at `cv.mintset.net` via Dokploy.

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

## Deploy (always applied)

- memory://main/guidelines/infrastructure-dokploy-traefik-no-caddy-for-tls
- memory://main/guidelines/devcontainer-docker-compose-pattern-for-dokploy-deployments

GitLab CI policy intentionally not applied: this repo is hosted on GitHub.

## Deviations from webapp policies

Recorded as a Basic Memory decision: `memory://main/guidelines/curriculum-stack-exceptions-to-webapp-policies`.

- Tailwind CSS v3 (policy targets v4 for the Vite-based webapp stack — not migrated).
- zustand instead of classic Redux (existing app — not migrated).
- Some data files/components remain plain JS/JSX; new code must be TypeScript.

## Project structure

- `src/app/` — Next.js App Router pages and components
- `src/data/` — CV content data (jobs, schools, skills...)
- `src/store/` — zustand store
- `docker-compose.yml` — production (Dokploy, Traefik labels, `expose` only, never `ports`)
- `docker-compose.override.yml` — dev-only (auto-merged by `docker compose up`)
- `.devcontainer/` — VS Code devcontainer matching `docker compose up`

## Commands

- `pnpm install` — install dependencies (respect `pnpm-workspace.yaml` hardening; approve build scripts deliberately with `pnpm approve-builds` / `allowBuilds`)
- `pnpm dev` — dev server
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint

## Docs maintenance

`docs/`, `README.md`, and this file are committed alongside the code they document; update them whenever architecture or scope changes.
