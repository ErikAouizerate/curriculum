import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const tools: Skill[] = [
  {
    label: labels.git,
    icon: "/icons/git.png",
    default: true,
  },
  {
    label: labels.github,
    icon: "/icons/github.png",
  },
  {
    label: labels.gitlab,
    icon: "/icons/gitlab.webp",
  },
  {
    label: labels.anglais,
    icon: "/icons/english.png",
    default: true,
  },
  {
    label: labels.scrum,
    icon: "/icons/kanban.png",
    default: true,
  },
  {
    label: labels.kanban,
    icon: "/icons/kanban.png",
  },
  {
    label: labels.rgpd,
    icon: "/icons/rgpd.png",
    default: true,
  },
  {
    label: labels.vscode,
    icon: "/icons/vscode.png",
  },
  {
    label: labels.linux,
    icon: "/icons/linux.png",
    default: true,
  },
  {
    label: labels.mac,
    icon: "/icons/macos.jpg",
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
    icon: "/icons/rocky.png",
    default: false,
  },
];
