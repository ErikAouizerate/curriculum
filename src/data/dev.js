import js from "@/../public/icons/js.jpg";
import ts from "@/../public/icons/typescript.webp";
import react from "@/../public/icons/react.png";
import redux from "@/../public/icons/redux.png";
import html5 from "@/../public/icons/html5.png";
import css3 from "@/../public/icons/css3.png";
import vue from "@/../public/icons/vuejs.svg";
import nuxt from "@/../public/icons/nuxtjs.svg";
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
import node from "@/../public/icons/node.webp";
import python from "@/../public/icons/python.webp";
import django from "@/../public/icons/django.svg";
import php from "@/../public/icons/php.png";
import java from "@/../public/icons/java.png";
import db from "@/../public/icons/db.png";
import prisma from "@/../public/icons/prisma.jpg";
import typeorm from "@/../public/icons/typeorm.png";
import nestjs from "@/../public/icons/nestjs.svg";
import fastify from "@/../public/icons/fastify.svg";
import postgresql from "@/../public/icons/postgresql.webp";
import mysql from "@/../public/icons/mysql.png";
import oracle from "@/../public/icons/oracle.png";
import golang from "@/../public/icons/golang.svg";
import gin from "@/../public/icons/gin.webp";
import expressjs from "@/../public/icons/express.webp";
import mongo from "@/../public/icons/mongo.png";
import symfony from "@/../public/icons/symfony.svg";
import nw from "@/../public/icons/nw.webp";
import plsql from "@/../public/icons/plsql.webp";
import webrtc from "@/../public/icons/webrtc.webp";
import firebase from "@/../public/icons/firebase.webp";
import graphql from "@/../public/icons/graphql.png";
import apollo from "@/../public/icons/apollo.png";
import rust from "@/../public/icons/rust.svg";
import fastapi from "@/../public/icons/FastAPI.svg";
import hapi from "@/../public/icons/hapi.png";
import mlflow from "@/../public/icons/mlflow.svg";
import polars from "@/../public/icons/polars.svg";
import labels from "./labels";

const FRONTEND = "frontend";
const BACKEND = "backend";

const data = [
  {
    label: labels.typescript,
    icon: ts,
    default: true,
    type: FRONTEND,
  },
  {
    label: labels.python,
    icon: python,
    default: true,
    type: BACKEND,
  },
  {
    label: labels.node,
    icon: node,
    default: true,
    type: BACKEND,
  },
  {
    label: labels.react,
    icon: react,
    default: true,
    type: FRONTEND,
  },
  {
    label: labels.postgresql,
    icon: postgresql,
    default: true,
    type: BACKEND,
  },
  {
    label: labels.javascript,
    icon: js,
    type: FRONTEND,
  },
  {
    label: labels.nextjs,
    icon: nextjs,
    type: FRONTEND,
  },
  {
    label: labels.svelte,
    icon: svelte,
    type: FRONTEND,
  },
  {
    label: labels.vue,
    icon: vue,
    type: FRONTEND,
  },
  {
    label: labels.nuxt,
    icon: nuxt,
    type: FRONTEND,
  },
  {
    label: labels.angular,
    icon: angular,
    type: FRONTEND,
  },
  {
    label: labels.remix,
    icon: remix,
    type: FRONTEND,
  },
  {
    label: labels.redux,
    icon: redux,
    type: FRONTEND,
  },
  {
    label: labels.tailwind,
    icon: tailwind,
    type: FRONTEND,
  },
  {
    label: labels.mantine,
    icon: mantine,
    type: FRONTEND,
  },
  {
    label: labels.materialui,
    icon: mui,
    type: FRONTEND,
  },
  {
    label: labels.primereact,
    icon: primereact,
    type: FRONTEND,
  },
  {
    label: labels.html5,
    icon: html5,
    type: FRONTEND,
  },
  {
    label: labels.css3,
    icon: css3,
    type: FRONTEND,
  },
  {
    label: labels.cordova,
    icon: cordova,
    type: FRONTEND,
  },
  {
    label: labels.d3,
    icon: d3,
    type: FRONTEND,
  },
  {
    label: labels.ol,
    icon: ol,
    type: FRONTEND,
  },
  {
    label: labels.reactTestingLibrary,
    icon: reactTestingLibrary,
    type: FRONTEND,
  },
  {
    label: labels.mlflow,
    icon: mlflow,
    type: BACKEND,
  },
  {
    label: labels.polars,
    icon: polars,
    type: BACKEND,
  },
  {
    label: labels.django,
    icon: django,
    type: BACKEND,
  },
  {
    label: labels.fastApi,
    icon: fastapi,
    type: BACKEND,
  },
  {
    label: labels.hapi,
    icon: hapi,
    type: BACKEND,
  },
  {
    label: labels.nestjs,
    icon: nestjs,
    type: BACKEND,
  },
  {
    label: labels.express,
    icon: expressjs,
    type: BACKEND,
  },
  {
    label: labels.rust,
    icon: rust,
    type: BACKEND,
  },
  {
    label: labels.golang,
    icon: golang,
    type: BACKEND,
  },
  {
    label: labels.gin,
    icon: gin,
    type: BACKEND,
  },
  {
    label: labels.php,
    icon: php,
    type: BACKEND,
  },
  {
    label: labels.fastify,
    icon: fastify,
    type: BACKEND,
  },
  {
    label: labels.java,
    icon: java,
    type: BACKEND,
  },
  {
    label: labels.plsql,
    icon: plsql,
    type: BACKEND,
  },

  {
    label: labels.mongodb,
    icon: mongo,
    type: BACKEND,
  },
  {
    label: labels.graphql,
    icon: graphql,
    type: BACKEND,
  },
  {
    label: labels.apollo,
    icon: apollo,
    type: BACKEND,
  },
  {
    label: labels.mariadb,
    icon: mysql,
    type: BACKEND,
  },
  {
    label: labels.firebase,
    icon: firebase,
    type: BACKEND,
  },
  {
    label: labels.oracle,
    icon: oracle,
    type: BACKEND,
  },
  {
    label: labels.prisma,
    icon: prisma,
    type: BACKEND,
  },
  {
    label: labels.typeorm,
    icon: typeorm,
    type: BACKEND,
  },
  {
    label: labels.symphony,
    icon: symfony,
    type: BACKEND,
  },
  {
    label: labels.nw,
    icon: nw,
    type: BACKEND,
  },
  {
    label: labels.webrtc,
    icon: webrtc,
    type: BACKEND,
  },
  {
    label: labels.db,
    icon: db,
    type: BACKEND,
  },
];

export default data;
