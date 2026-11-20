import type { Skill } from "#lib/content/types.js";
import { labels } from "#lib/content/labels.js";

export const devopsSkills: Skill[] = [
  {
    label: "Docker",
    icon: "/icons/docker.png",
    match: [
      labels.docker,
      labels.kubernetes,
      labels.helm,
      labels.openshift,
      labels.swarm,
      labels.incus,
      labels.kvm,
      labels.gitleaks,
      labels.opengrep,
      labels.trivy,
      labels.checkov,
      labels.osvScanner,
    ],
  },
  {
    label: "Gitlab ci",
    icon: "/icons/gitlab.webp",
    default: true,
    match: [
      labels.gitlabci,
      labels.githubAction,
      labels.jenkins,
      labels.circleci,
      labels.codemagic,
      labels.cicd,
    ],
  },
  {
    label: "Terraform",
    icon: "/icons/terraform.svg",
    match: [labels.terraform, labels.awx],
  },
  {
    label: "Ansible",
    icon: "/icons/ansible.svg",
    default: true,
  },
  {
    label: "Grafana LGTM",
    icon: "/icons/grafana.svg",
    default: true,
    match: [labels.grafana, labels.prometheus, labels.loki, labels.falco],
  },
  {
    label: "Keycloak",
    icon: "/icons/keycloak.svg",
    default: true,
    match: [labels.keycloak, labels.wso2, labels.JWT],
  },
  {
    label: "Build",
    icon: "/icons/webpack.jpg",
    match: [labels.webpack, labels.vite],
  },
  {
    label: "Tests",
    icon: "/icons/jest.webp",
    match: [labels.jest, labels.cypress],
  },
  {
    label: "Artefacts",
    icon: "/icons/artifactory.svg",
    match: [labels.artifactory],
  },
  {
    label: "Mobile",
    icon: "/icons/capacitorjs.webp",
    match: [labels.capacitor],
  },
  {
    label: "Linux",
    icon: "/icons/linux.png",
    default: true,
    match: [
      labels.linux,
      labels.ubuntu,
      labels.rocky,
      labels.mac,
      labels.windows,
    ],
  },
];
