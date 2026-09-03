import docker from "@/../public/icons/docker.png";
import gitlab from "@/../public/icons/gitlab.webp";
import terraform from "@/../public/icons/terraform.svg";
import grafana from "@/../public/icons/grafana.svg";
import aws from "@/../public/icons/AWS.webp";
import keycloak from "@/../public/icons/keycloak.svg";
import webpack from "@/../public/icons/webpack.jpg";
import jest from "@/../public/icons/jest.webp";
import artifactory from "@/../public/icons/artifactory.svg";
import ansible from "@/../public/icons/ansible.svg";
import capacitorjs from "@/../public/icons/capacitorjs.webp";

import labels from "./labels";

const data = [
  {
    label: "Docker",
    icon: docker,
    match: [
      labels.docker,
      labels.kubernetes,
      labels.helm,
      labels.openshift,
      labels.swarm,
    ],
  },
  {
    label: "Gitlab ci",
    icon: gitlab,
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
    icon: terraform,
    default: true,
    match: [labels.terraform, labels.awx],
  },
  {
    label: "Ansible",
    icon: ansible,
    default: true,
  },
  {
    label: "Grafana LGTM",
    icon: grafana,
    default: true,
    match: [labels.grafana, labels.prometheus, labels.loki, labels.falco],
  },
  {
    label: "Keycloak",
    icon: keycloak,
    default: true,
    match: [labels.keycloak, labels.wso2, labels.JWT],
  },
  {
    label: "Build",
    icon: webpack,
    match: [labels.webpack, labels.vite],
  },
  {
    label: "Tests",
    icon: jest,
    match: [labels.jest, labels.cypress],
  },
  {
    label: "Artefacts",
    icon: artifactory,
    match: [labels.artifactory],
  },
  {
    label: "Mobile",
    icon: capacitorjs,
    match: [labels.capacitor],
  },
];

export default data;
