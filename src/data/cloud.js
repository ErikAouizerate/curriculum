import aws from "@/../public/icons/AWS.webp";
import kubernetes from "@/../public/icons/kubernetes.jpg";
import docker from "@/../public/icons/docker.png";
import terraform from "@/../public/icons/terraform.svg";
import openshift from "@/../public/icons/openshift.webp";
import traefik from "@/../public/icons/traefik.svg";

import labels from "./labels";

const data = [
  {
    label: labels.docker,
    icon: docker,
    default: true,
  },
  {
    label: labels.kubernetes,
    icon: kubernetes,
    default: true,
  },
  {
    label: labels.openshift,
    icon: openshift,
    default: true,
  },
  {
    label: labels.terraform,
    icon: terraform,
    default: true,
  },
  {
    label: labels.aws,
    icon: aws,
    default: true,
  },
  {
    label: labels.traefik,
    icon: traefik,
  },
];

export default data;
