import jest from "@/../public/icons/jest.webp";
import cypress from "@/../public/icons/cypress.png";
import docker from "@/../public/icons/docker.png";
import dockerSwarm from "@/../public/icons/docker-swarm.webp";
import webpack from "@/../public/icons/webpack.jpg";
import vite from "@/../public/icons/vite.webp";
import circleci from "@/../public/icons/circleci.png";

import gitlab from "@/../public/icons/gitlab.webp";
import aws from "@/../public/icons/AWS.webp";
import vercel from "@/../public/icons/vercel.svg";

import keycloak from "@/../public/icons/keycloak.svg";
import wso2 from "@/../public/icons/wso2.svg";
import ansible from "@/../public/icons/ansible.svg";
import awx from "@/../public/icons/awx.png";
import netlify from "@/../public/icons/netlify.png";
import clevercloud from "@/../public/icons/clevercloud.webp";
import heroku from "@/../public/icons/heroku.webp";
import gcp from "@/../public/icons/gcp.webp";
import capacitorjs from "@/../public/icons/capacitorjs.webp";

import labels from "./labels";

const data = [
  {
    label: labels.docker,
    icon: docker,
    link: "https://www.docker.com/",
    default: true,
  },
  {
    label: labels.swarm,
    icon: dockerSwarm,
  },

  {
    label: labels.webpack,
    icon: webpack,
    link: "https://webpack.js.org/",
  },
  {
    label: labels.vite,
    icon: vite,
  },
  {
    label: labels.circleci,
    icon: circleci,
  },
  {
    label: labels.gitlabci,
    icon: gitlab,
  },
  {
    label: labels.ansible,
    icon: ansible,
    default: true,
  },
  {
    label: labels.awx,
    icon: awx,
  },
  {
    label: labels.aws,
    icon: aws,
    default: true,
  },
  {
    label: labels.vercel,
    icon: vercel,
  },
  {
    label: labels.netlify,
    icon: netlify,
  },
  {
    label: labels.clevercloud,
    icon: clevercloud,
  },
  {
    label: labels.heroku,
    icon: heroku,
  },
  {
    label: labels.jest,
    icon: jest,
  },
  {
    label: labels.cypress,
    icon: cypress,
  },
  {
    label: labels.gcp,
    icon: gcp,
  },
  {
    label: labels.capacitor,
    icon: capacitorjs,
  },
  {
    label: labels.keycloak,
    icon: keycloak,
    default: true,
  },
  {
    label: labels.wso2,
    icon: wso2,
  },
];

export default data;
