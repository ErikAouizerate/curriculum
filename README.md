# curriculum

Personal CV/résumé site — Next.js 14 (App Router) + TypeScript + Tailwind CSS, deployed at [erik-aouizerate.me](https://www.erik-aouizerate.me/) via Vercel.

## Getting Started

This project uses **pnpm** (see `pnpm-workspace.yaml` for the supply-chain hardening settings).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- **Local dev**: `pnpm dev` — or, optionally, containerized: `docker compose up` automatically
  merges `docker-compose.override.yml` on top of `docker-compose.yml` (bind-mounted source,
  hot reload, port 3000 on `localhost`). You can also open the repo in VS Code and
  "Reopen in Container".
- **Production**: deployed via **Vercel** (GitHub integration — push to `main` deploys).
  Docker is not used in production; there is no Dokploy/Traefik reverse proxy for this site.

## Conventions

See [AGENTS.md](./AGENTS.md) — stack policies, package manager rules, and deployment constraints.
