import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const cloudSkills: Skill[] = [
  {
    label: labels.docker,
    icon: "/icons/docker.webp",
    default: true,
  },
  {
    label: labels.kubernetes,
    icon: "/icons/kubernetes.webp",
    default: true,
  },
  {
    label: labels.openshift,
    icon: "/icons/openshift.webp",
    default: true,
  },
  {
    label: labels.terraform,
    icon: "/icons/terraform.svg",
    default: true,
  },
  {
    label: labels.aws,
    icon: "/icons/AWS.webp",
    default: true,
  },
  {
    label: labels.traefik,
    icon: "/icons/traefik.svg",
  },
];
