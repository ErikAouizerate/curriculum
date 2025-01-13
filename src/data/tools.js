import git from "@/../public/icons/git.png";
import github from "@/../public/icons/github.png";
import gitlab from "@/../public/icons/gitlab.webp";
import english from "@/../public/icons/english.png";
import kanban from "@/../public/icons/kanban.png";
import vscode from "@/../public/icons/vscode.png";
import linux from "@/../public/icons/linux.png";
import rgpd from "@/../public/icons/rgpd.png";
import macos from "@/../public/icons/macos.jpg";
import windows from "@/../public/icons/windows.webp";
import rocky from "@/../public/icons/rocky.png";
import ubuntu from "@/../public/icons/ubuntu.svg";

import labels from "./labels";

const data = [
  {
    label: labels.git,
    icon: git,
    default: true,
  },
  {
    label: labels.github,
    icon: github,
  },
  {
    label: labels.gitlab,
    icon: gitlab,
  },
  {
    label: labels.anglais,
    icon: english,
    default: true,
  },
  {
    label: labels.scrum,
    icon: kanban,
    default: true,
  },
  {
    label: labels.kanban,
    icon: kanban,
  },
  {
    label: labels.rgpd,
    icon: rgpd,
  },
  {
    label: labels.vscode,
    icon: vscode,
  },
  {
    label: labels.linux,
    icon: linux,
    default: true,
  },
  {
    label: labels.mac,
    icon: macos,
  },
  {
    label: labels.windows,
    icon: windows,
  },
  {
    label: labels.ubuntu,
    icon: ubuntu,
    default: false,
  },
  {
    label: labels.rocky,
    icon: rocky,
    default: false,
  },
];

export default data;
