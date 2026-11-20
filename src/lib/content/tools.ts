import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const tools: Skill[] = [
  {
    label: labels.git,
    icon: "/icons/git.webp",
    default: true,
  },
  {
    label: labels.github,
    icon: "/icons/github.webp",
  },
  {
    label: labels.gitlab,
    icon: "/icons/gitlab.webp",
  },
  {
    label: labels.anglais,
    icon: "/icons/english.webp",
    default: true,
  },
  {
    label: labels.scrum,
    icon: "/icons/kanban.webp",
    default: true,
  },
  {
    label: labels.kanban,
    icon: "/icons/kanban.webp",
  },
  {
    label: labels.rgpd,
    icon: "/icons/rgpd.webp",
    default: true,
  },
  {
    label: labels.vscode,
    icon: "/icons/vscode.webp",
  },
  {
    label: labels.linux,
    icon: "/icons/linux.webp",
    default: true,
  },
  {
    label: labels.mac,
    icon: "/icons/macos.webp",
  },
  {
    label: labels.windows,
    icon: "/icons/windows.webp",
  },
  {
    label: labels.ubuntu,
    icon: "/icons/ubuntu.svg",
    default: false,
  },
  {
    label: labels.rocky,
    icon: "/icons/rocky.webp",
    default: false,
  },
];
