import type { Label } from "#lib/content/labels.js";
import { labels } from "#lib/content/labels.js";

export interface Project {
  /** Stable identifier the assistant uses to cite the project. */
  id: string;
  title: string;
  summary: string;
  tools: Label[];
  /** Public link (GitHub repository or live site); client projects may have none. */
  url?: string;
  /** Thumbnail under `static/`. */
  image?: string;
  /** Full presentation shown in a modal when the project has no public link. */
  screenshot?: string;
}

const GITHUB = "https://github.com/ErikAouizerate";

/** Projects the portfolio assistant may recommend: public repositories and client work. */
export const projects: Project[] = [
  {
    id: "devsandbox",
    url: `${GITHUB}/devsandbox`,
    title: "devsandbox",
    summary:
      "Runs AI coding agents in a per-project sandbox (bubblewrap, Docker or libkrun microVM) that keeps the real dev environment but hides SSH keys, cloud credentials and .env files, with an optional filtering MITM proxy.",
    tools: [labels.golang, labels.docker, labels.linux, labels.llm],
  },
  {
    id: "manege",
    url: `${GITHUB}/manege`,
    title: "manège",
    summary:
      "Hardened Linux host for LLM-driven code: confined agent user, rootless Docker, ACL workspace, nftables egress per UID and secret substitution through a proxy chain.",
    tools: [labels.linux, labels.docker, labels.llm],
  },
  {
    id: "sandbox-opencode",
    url: `${GITHUB}/sandbox-opencode`,
    title: "sandbox-opencode",
    summary:
      "Runs the opencode agent inside a hardware-isolated KVM VM on an Incus host, so it only reaches one shared folder, never the host or the LAN.",
    tools: [labels.incus, labels.kvm, labels.opencode, labels.linux],
  },
  {
    id: "lares",
    url: `${GITHUB}/lares`,
    title: "lares",
    summary:
      "Small Go wrapper that owns a persistent sandbox container for coding agents, entered from any repository mounted at its host path.",
    tools: [labels.golang, labels.incus, labels.linux],
  },
  {
    id: "basic-memory",
    url: `${GITHUB}/basic-memory`,
    title: "Basic Memory gateway",
    summary:
      "Authenticated remote HTTP gateway for the Basic Memory MCP server, so any MCP client can read, write and search a shared knowledge base from any machine.",
    tools: [labels.python, labels.mcp, labels.docker, labels.llm],
  },
  {
    id: "ia-dashboard",
    url: `${GITHUB}/ia-dashboard`,
    title: "ia-dashboard",
    summary:
      "Local FinOps dashboard reading the OpenCode database to report cost, tokens and activity per session, project and model (NestJS, Drizzle, Postgres, React).",
    tools: [
      labels.typescript,
      labels.nestjs,
      labels.react,
      labels.postgresql,
      labels.finops,
      labels.opencode,
    ],
  },
  {
    id: "security-check",
    url: `${GITHUB}/security-check`,
    title: "security-check",
    summary:
      "Single Docker image bundling a pinned security-audit toolchain (secrets, SAST, dependencies, IaC), usable locally and in GitHub Actions.",
    tools: [
      labels.docker,
      labels.githubAction,
      labels.gitleaks,
      labels.opengrep,
      labels.trivy,
      labels.checkov,
      labels.osvScanner,
    ],
  },
  {
    id: "docker-compose-ui",
    url: `${GITHUB}/docker-compose-ui`,
    title: "dc-ui",
    summary:
      "Localhost Docker Compose observer: discovers containers, groups them by project, shows ports and logs, and starts or stops them (Go API, React webapp).",
    tools: [labels.golang, labels.react, labels.typescript, labels.tailwind, labels.docker],
  },
  {
    id: "curriculum",
    url: `${GITHUB}/curriculum`,
    title: "curriculum",
    summary:
      "This site: static SvelteKit CV with zero JavaScript, a URL-encoded CV editor, build-time PDF and this streaming portfolio assistant.",
    tools: [labels.svelte, labels.typescript, labels.tailwind, labels.vercel, labels.llm],
  },
  // Client projects, imported from the previous portfolio (github.com/ErikAouizerate/portfolio).
  {
    id: "godofgames",
    title: "God of Games",
    summary:
      "Product design and development of GodOfGames.io, a progressive web app for organising board-game tournaments online, with a showcase site and a Discord server (2024).",
    tools: [labels.react, labels.nextjs, labels.vercel, labels.prisma, labels.tailwind],
    image: "/projects/godofgames.webp",
    screenshot: "/projects/godofgames-full.webp",
  },
  {
    id: "linkeys",
    title: "Linkeys",
    summary:
      "Full rebuild of a referral-based recruitment SaaS (B2B/B2C job board, mobile apps, microservices) serving 200+ companies and 40k users (2021–2023).",
    tools: [
      labels.react,
      labels.typescript,
      labels.aws,
      labels.node,
      labels.postgresql,
      labels.docker,
    ],
    image: "/projects/linkeys.webp",
    screenshot: "/projects/linkeys-full.webp",
  },
  {
    id: "jobteaser",
    title: "JobTeaser",
    summary:
      "Migration of the JobTeaser student job platform to a React single-page application, so students can search and apply for jobs.",
    tools: [labels.react, labels.redux, labels.circleci],
    image: "/projects/jobteaser.webp",
    screenshot: "/projects/jobteaser-full.webp",
  },
];
