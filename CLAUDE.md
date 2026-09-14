# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal CV/résumé site — Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS v3, deployed at [erik-aouizerate.me](https://www.erik-aouizerate.me/) via Vercel (GitHub integration, push to `main` deploys). It's a single scrollable page rendering an interactive/printable CV, with an "edit mode" (`?edit=1`) for pruning content before exporting to PDF.

## Commands

- `pnpm install` — install dependencies (respects `pnpm-workspace.yaml` supply-chain hardening; approve build scripts deliberately with `pnpm approve-builds`)
- `pnpm dev` — dev server (http://localhost:3000)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — ESLint
- `docker compose up` — optional containerized dev (merges `docker-compose.override.yml` onto `docker-compose.yml`: bind mount, `pnpm dev`, Caddy labels); serves at http://curriculum.localhost via the shared `local-proxy` network

No test suite exists in this project.

**Package manager is pnpm — enforced.** Do not use npm or yarn.

## Language conventions

- Communicate with the user in French.
- All code, comments, commit messages, and docs are written in English.
- New code must be TypeScript (`.tsx`/`.ts`); several legacy `.jsx`/`.js` files remain (see Deviations) but are not being migrated proactively.

## Architecture

### Data-driven content, not CMS

Everything editorial (skills, jobs, schools, tool labels) lives as plain JS data modules under `src/data/`, imported directly into components. There is no CMS/API — updating CV content means editing these files.

- `src/data/labels.js` — the canonical dictionary of tool/skill names (single source of truth for display strings; other data files reference `labels.x` rather than hardcoding strings).
- `src/data/jobs.js` — work experience entries (`title`, `start`/`end`, `description`, `tasks[]`, `tools[]` referencing `labels`, plus `default`/`small` flags — see below).
- `src/data/schools.js` — education entries, rendered directly in `page.tsx` (not connected to the zustand store).
- **Two parallel skill categorizations exist over the same underlying tool set**, used by different parts of the UI:
  - `dev.js` / `ia.js` / `infra.js` / `transverse.js` — the "Compétences" section groupings (Fullstack / Ingénierie IA / DevOps / Transverse), consumed by the zustand store (`src/store/index.ts`) and rendered via `Skill.jsx`.
  - `frontend.js` / `backend.js` / `infra.js` / `tools.js` — a different grouping used only in `Job.tsx` to color-code each job's tool badges (border color by category). Note `infra.js` is shared by both categorizations.
  - When adding a new tool/skill, check whether it needs entries in the relevant file(s) from *both* groupings.

### State: zustand store + implicit undo stack

`src/store/index.ts` holds the CV's currently-displayed subset of skills/jobs (used for the interactive "filter down the CV" edit experience). Key points:

- `data.skills.{dev,ia,devops,transverse}` and `data.jobs` start pre-filtered to entries flagged `default: true` (or `small: true` for jobs) in the data files — this is the CV's default/print view.
- Every mutating action pushes `current(state.data)` (via immer) onto `history` before applying the change, giving a single global `undo()`.
- `jobsActions.addSkills(tools)(clear)` is the bridge between jobs and skills: clicking a job's "add its tools" icon (in `Job.tsx`, edit mode) re-filters all four skill categories to those matching the job's `tools[]` (matched via each skill's `match[]` aliases or its `label`), optionally clearing (`clear=true`) or merging (`clear=false`) with the currently-shown skills.
- `reset()` restores the `default`-flagged subsets; `showAll()` reveals every skill/job unfiltered.

### Page structure

`src/app/page.tsx` is the entire page: header (contact info, photo, summary) + three `Section`s (Compétences, Expériences professionnelles, Formations) driven by the store. `isEdit` (from `?edit=` query param) toggles per-item edit affordances (remove/filter/reorder icons) across `Section.jsx`, `Job.tsx`, and `Skill.jsx` — these are hidden entirely outside edit mode and always hidden under `print:`. PDF export is `window.print()` triggered from a fixed action rail, styled via Tailwind `print:` variants throughout rather than a separate print stylesheet.

## Deviations from standard stack policy

(Recorded as Basic Memory decisions — see « Curriculum — Stack Exceptions to Webapp Policies », project "main".)

- Tailwind CSS v3 (not v4).
- zustand for state, not Redux.
- Some legacy plain JS/JSX files remain (`Section.jsx`, `Skill.jsx`, and all of `src/data/*.js`) — acceptable as-is; new code must be TypeScript.

## Deploy

Vercel only. Docker is for local dev convenience — there is no Dokploy/Traefik and those infra policies don't apply here (see « Curriculum — Vercel Deployment (No Dokploy, No Traefik) », project "main"). Local dev is routed by the shared caddy-docker-proxy on the `local-proxy` network at http://curriculum.localhost.
