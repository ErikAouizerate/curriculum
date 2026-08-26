# curriculum

Personal CV/résumé site — Next.js 14 (App Router) + TypeScript + Tailwind CSS, deployed at [cv.mintset.net](https://cv.mintset.net) via Dokploy.

## Getting Started

This project uses **pnpm** (see `pnpm-workspace.yaml` for the supply-chain hardening settings).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

This project uses a devcontainer + Docker Compose setup.

- **Local dev**: `docker compose up` — automatically merges `docker-compose.override.yml`
  on top of `docker-compose.yml` (bind-mounted source, hot reload, ports exposed to
  `localhost`). Or open the repo in VS Code and "Reopen in Container".
- **Production (Dokploy)**: Dokploy deploys `docker-compose.yml` as-is. Services use
  `expose` (not `ports`) — Dokploy's reverse proxy (Traefik) handles public routing and
  TLS internally, so no host port is published. Do not add `ports:` mappings to this file.

## Conventions

See [AGENTS.md](./AGENTS.md) — stack policies, package manager rules, and deployment constraints.
