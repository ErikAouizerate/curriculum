import git from "@/../public/icons/git.png";
import linux from "@/../public/icons/linux.png";
import kanban from "@/../public/icons/kanban.png";
import english from "@/../public/icons/english.png";
import rgpd from "@/../public/icons/rgpd.png";
import vscode from "@/../public/icons/vscode.png";

import labels from "./labels";

const data = [
  {
    label: labels.git,
    icon: git,
    default: true,
    match: [labels.git, labels.github, labels.gitlab],
  },
  {
    label: "Linux",
    icon: linux,
    default: true,
    match: [labels.linux, labels.ubuntu, labels.rocky, labels.mac, labels.windows],
  },
  {
    label: "Agile",
    icon: kanban,
    default: true,
    match: [labels.scrum, labels.kanban],
  },
  {
    label: labels.anglais,
    icon: english,
    default: true,
    match: [labels.anglais],
  },
  {
    label: labels.rgpd,
    icon: rgpd,
    default: true,
    match: [labels.rgpd],
  },
  {
    label: labels.vscode,
    icon: vscode,
    default: true,
    match: [labels.vscode],
  },
];

export default data;