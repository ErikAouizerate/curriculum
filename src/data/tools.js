import git from "../../public/icons/git.png";
import github from "../../public/icons/github.png";
import gitlab from "../../public/icons/gitlab.webp";
import english from "../../public/icons/english.png";
import kanban from "../../public/icons/kanban.png";
import vscode from "../../public/icons/vscode.png";
// import linux from "../../public/icons/linux.png";
// import rgpd from "../../public/icons/rgpd.png";
// import macos from "../../public/icons/macos.jpg";
import windows from "../../public/icons/windows.webp";
import figma from "../../public/icons/figma.png";
import androidStudio from "../../public/icons/androidStudio.png";
import SVN from "../../public/icons/svn.png";
import xd from "../../public/icons/xd.png";

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
    label: labels.vscode,
    icon: vscode,
    default: true,

  },
  {
    label: labels.figma,
    icon: figma,
    default: true,
  },
  {
    label: labels.windows,
    icon: windows,
  },
  {
    label: labels.androidStudio,
    icon: androidStudio,
  },
  {
    label: labels.adobeXD,
    icon: xd,
  },
  {
    label: labels.SVN,
    icon: SVN,
  },
];

// const data = [
//   {
//     label: labels.git,
//     icon: git,
//     default: true,
//   },
//   {
//     label: labels.github,
//     icon: github,
//   },
//   {
//     label: labels.gitlab,
//     icon: gitlab,
//   },
//   {
//     label: labels.anglais,
//     icon: english,
//     default: true,
//   },
//   {
//     label: labels.scrum,
//     icon: kanban,
//     default: true,
//   },
//   {
//     label: labels.kanban,
//     icon: kanban,
//   },
//   {
//     label: labels.rgpd,
//     icon: rgpd,
//   },
//   {
//     label: labels.vscode,
//     icon: vscode,
//   },
//   {
//     label: labels.linux,
//     icon: linux,
//     default: true,
//   },
//   {
//     label: labels.mac,
//     icon: macos,
//     default: true,
//   },
//   {
//     label: labels.windows,
//     icon: windows,
//     default: true,
//   },
// ];

export default data;
