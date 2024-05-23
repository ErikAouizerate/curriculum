// import jest from "../../public/icons/jest.webp";
// import cypress from "../../public/icons/cypress.png";
import docker from "../../public/icons/docker.png";
import webpack from "../../public/icons/webpack.jpg";
import vite from "../../public/icons/vite.webp";
// import circleci from "../../public/icons/circleci.png";

import gitlab from "../../public/icons/gitlab.webp";
import aws from "../../public/icons/AWS.webp";
import vercel from "../../public/icons/vercel.svg";

import netlify from "../../public/icons/netlify.png";
import clevercloud from "../../public/icons/clevercloud.webp";
// import heroku from "../../public/icons/heroku.webp";
// import gcp from "../../public/icons/gcp.webp";
import capacitorjs from "../../public/icons/capacitorjs.webp";
import azure from "../../public/icons/azure.webp";
import codemagic from "../../public/icons/codemagic.png";


import labels from "./labels";

const data = [
  {
    label: labels.docker,
    icon: docker,
    link: "https://www.docker.com/",
    default: true,
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
    label: labels.gitlabci,
    icon: gitlab,
    default: true,
  },
  {
    label: labels.aws,
    icon: aws,
  },
  {
    label: labels.vercel,
    icon: vercel,
    default:true,
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
    label: labels.capacitor,
    icon: capacitorjs,
  },
  {
    label: labels.codemagic,
    icon: codemagic,
  },
  {
    label: labels.azure,
    icon: azure,
    default:true
  },
];


// const data = [
//   {
//     label: labels.docker,
//     icon: docker,
//     link: "https://www.docker.com/",
//     default: true,
//   },
//   {
//     label: labels.webpack,
//     icon: webpack,
//     link: "https://webpack.js.org/",
//     default: true,
//   },
//   {
//     label: labels.vite,
//     icon: vite,
//   },
//   {
//     label: labels.circleci,
//     icon: circleci,
//   },
//   {
//     label: labels.gitlabci,
//     icon: gitlab,
//   },
//   {
//     label: labels.aws,
//     icon: aws,
//     default: true,
//   },
//   {
//     label: labels.vercel,
//     icon: vercel,
//   },
//   {
//     label: labels.netlify,
//     icon: netlify,
//   },
//   {
//     label: labels.clevercloud,
//     icon: clevercloud,
//   },
//   {
//     label: labels.heroku,
//     icon: heroku,
//     default: true,
//   },
//   {
//     label: labels.jest,
//     icon: jest,
//   },
//   {
//     label: labels.cypress,
//     icon: cypress,
//     default: true,
//   },
//   {
//     label: labels.gcp,
//     icon: gcp,
//   },
//   {
//     label: labels.capacitor,
//     icon: capacitorjs,
//     default: true,
//   },
// ];


export default data;
