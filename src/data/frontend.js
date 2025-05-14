import js from "@/../public/icons/js.jpg";
import ts from "@/../public/icons/typescript.webp";
import react from "@/../public/icons/react.png";
import redux from "@/../public/icons/redux.png";
import html5 from "@/../public/icons/html5.png";
import css3 from "@/../public/icons/css3.png";
import vue from "@/../public/icons/vuejs.svg";
import svelte from "@/../public/icons/svelte.webp";

import d3 from "@/../public/icons/d3.png";
import remix from "@/../public/icons/remix.png";
import nextjs from "@/../public/icons/nextjs.svg";
import mantine from "@/../public/icons/mantine.webp";
import tailwind from "@/../public/icons/tailwind.webp";
import mui from "@/../public/icons/mui.png";
import angular from "@/../public/icons/angular.jpg";
import primereact from "@/../public/icons/primereact.png";
import cordova from "@/../public/icons/cordova.webp";
import ol from "@/../public/icons/ol.svg";
import reactTestingLibrary from "@/../public/icons/reactTestingLibrary.png";

import labels from "./labels";

const data = [
  {
    label: labels.typescript,
    icon: ts,
    default: true,
  },
  {
    label: labels.javascript,
    icon: js,
  },
  {
    label: labels.react,
    icon: react,
    default: true,
  },
  {
    label: labels.nextjs,
    icon: nextjs,
    default: true,
  },
  {
    label: labels.svelte,
    icon: svelte,
    default: true,
  },
  {
    label: labels.vue,
    icon: vue,
  },
  {
    label: labels.angular,
    icon: angular,
  },
  {
    label: labels.remix,
    icon: remix,
  },
  {
    label: labels.redux,
    icon: redux,
  },
  {
    label: labels.tailwind,
    icon: tailwind,
  },
  {
    label: labels.mantine,
    icon: mantine,
  },
  {
    label: labels.materialui,
    icon: mui,
  },
  {
    label: labels.primereact,
    icon: primereact,
  },
  {
    label: labels.html5,
    icon: html5,
  },
  {
    label: labels.css3,
    icon: css3,
  },
  {
    label: labels.cordova,
    icon: cordova,
  },
  {
    label: labels.d3,
    icon: d3,
  },
  {
    label: labels.ol,
    icon: ol,
    default: true,
  },
  {
    label: labels.reactTestingLibrary,
    icon: reactTestingLibrary,
  },
];

export default data;
