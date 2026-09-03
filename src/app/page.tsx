"use client";

import Image from "next/image";
import avatar from "../../public/avatar.jpg";
import dayjs from "dayjs";
import Section from "./Section";
import Skill from "./Skill";
import Job from "./Job";
import schoolsData from "@/data/schools";

import {
  IconAerialLift,
  IconArrowBack,
  IconArrowsVertical,
  IconColorSwatch,
  IconDeviceMobile,
  IconDownload,
  IconFilter,
  IconMail,
  IconPrinter,
  IconSchool,
  IconShare,
  IconWorld,
  IconQuote,
  IconMessageCircle,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";

import useStore from "@/store";
import cx from "classnames";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Icon before the text on mobile, after it on desktop/print (right-aligned column).
const contactLine =
  "flex items-center gap-2 md:flex-row-reverse print:flex-row-reverse";

export default function Page() {
  const searchParams = useSearchParams();

  const isEdit = !!searchParams.get("edit");

  const yearsOld = dayjs().diff(dayjs("1986-04-07"), "years");

  const skills = useStore((state) => state.data.skills);
  const jobs = useStore((state) => state.data.jobs);
  const skillsActions = useStore((state) => state.skillsActions);
  const jobsActions = useStore((state) => state.jobsActions);

  const reset = useStore((state) => state.reset);
  const showAll = useStore((state) => state.showAll);
  const hasHistory = useStore((state) => state.history.length);

  const undo = useStore((state) => state.undo);

  const [isForPrint, setIsForPrint] = useState(false);

  // const openImage = (imagePath) => {
  //   // Ouvre l'image dans un nouvel onglet
  //   const imageWindow = window.open("", "_blank");

  //   // Applique le style pour afficher l'image en pleine largeur avec défilement vertical
  //   imageWindow.document.write(`
  //     <style>
  //       body, html {
  //         margin: 0;
  //         padding: 0;
  //         width: 100vw;
  //         height: auto;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         overflow-y: auto; /* Permet le défilement vertical */
  //         overflow-x: hidden;
  //         background-color: #f3f4f6;
  //         box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  //       }
  //       img {
  //         width: 80vw;
  //         height: auto;
  //         display: block;
  //       }
  //     </style>
  //     <img src="${imagePath}" alt="Image en pleine largeur" />
  //   `);
  // };

  return (
    <div
      className={cx("relative mb-6", {
        // ["print:grayscale"]: isForPrint,
      })}
    >
      {/* <div className="fixed top-32 w-[calc(calc(calc(100vw-21cm)/2)-7px)] ">
        <div className="hidden lg:flex flex-col items-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium text-secondary/70">
              Portfolio
            </h3>
            <a
              className="block underline text-primary/50"
              target="_blank"
              href="#"
              onClick={() => openImage("/godofgames_pres.png")}
            >
              Projet GodOfGames
            </a>
            <a
              className="block underline text-primary/50"
              target="_blank"
              href="#"
              onClick={() => openImage("/linkeys_pres.png")}
            >
              Projet Linkeys
            </a>
          </div>
        </div>
      </div> */}
      {isEdit && (
        <div className="fixed top-0 flex flex-col m-4 ml-[calc(calc(calc(100vw-21cm)/2)+21cm)] ">
          <IconArrowsVertical
            className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
            onClick={showAll}
            size={48}
          />
          <IconFilter
            className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
            onClick={reset}
            size={48}
          />
          <IconArrowBack
            className={cx(
              "rounded-full cursor-pointer hover:bg-stone-200 p-2",
              {
                ["text-stone-300"]: !hasHistory,
                ["hover:bg-inherit"]: !hasHistory,
                ["cursor-auto"]: !hasHistory,
              },
            )}
            onClick={undo}
            size={48}
          />
        </div>
      )}
      <div
        className={cx(
          "md:w-[21cm] m-auto bg-stone-200 min-h-[29.7cm] print:bg-white",
          {
            // ["print:bg-white"]: isForPrint,
          },
        )}
      >
        <header className="animate-enter1 bg-primary/90 text-white print:text-black print:bg-white">
          <div className="flex flex-col bg-primary py-6  justify-center items-center px-6 print:pb-0 text-center print:bg-white">
            <h1 className="text-white print:text-black text-xl font-bold ">
              INGÉNIEUR LOGICIEL SENIOR — AI, Fullstack & DevOps
            </h1>
            <h2 className="hidden md:inline print:inline text-white/50 print:text-black text-md font-medium">
              Typescript&nbsp;&nbsp;|&nbsp;&nbsp;Python&nbsp;&nbsp;|&nbsp;&nbsp;Cloud&nbsp;&nbsp;|&nbsp;&nbsp;Agentic
            </h2>
          </div>

          <div className="relative md:flex md:flex-row py-4 md:py-0  md:relative print:relative print:py-0">
            <div className="absolute right-4 md:-left-0 md:block print:block print:left-2 mt-4 md:mt-0 ml-4">
              <Image
                alt="Photo du profil"
                src={avatar}
                className="float md:absolute print:absolute -top-5 rounded-full min-w-24 min-h-24 max-w-28 max-h-28 object-cover"
              />
            </div>
            <div className="pl-4 md:pl-32 print:pl-32 print:py-2 py-6 px-4 flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-6">
              <div className="flex flex-col justify-start mt-6 md:mt-0 md:ml-4 print:mt-0 print:ml-6">
                <div className="font-bold text-2xl pb-4">Erik Aouizerate</div>
                <div className="text-lg text-white/50 print:text-black">
                  {yearsOld} ans
                </div>
                <div className="text-lg text-white/50 print:text-black">
                  Expérience : {yearsOld - 27} années
                </div>
                <div className="text-lg text-white/50 print:text-black">
                  Anglais : B2
                </div>
              </div>
              <div className="flex flex-col text-base leading-tight gap-1 mt-2">
                {/* <div className={contactLine}>
                  <IconMessageCircle size={20} className="text-secondary" />
                  <span>Français, Anglais</span>
                </div> */}
                <div className={contactLine}>
                  <IconDeviceMobile size={20} className="text-secondary" />
                  <a href="tel:+330601994602">06 01 99 46 02</a>
                </div>
                <div className={contactLine}>
                  <IconMail size={20} className="text-secondary" />
                  <a href="mailto:erik.aouizerate.pro@gmail.com">
                    erik.aouizerate.pro@gmail.com
                  </a>
                </div>
                <div className={contactLine}>
                  <IconBrandLinkedin size={20} className="text-secondary" />
                  <a
                    href="https://www.linkedin.com/in/erik-aouizerate-a9985257/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/erik-aouizerate
                  </a>
                </div>
                <div className={contactLine}>
                  <IconBrandGithub size={20} className="text-secondary" />
                  <a
                    href="https://github.com/ErikAouizerate/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/ErikAouizerate
                  </a>
                </div>
                <div className={contactLine}>
                  <IconWorld size={20} className="text-secondary" />
                  <a
                    href="https://erik-aouizerate.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    erik-aouizerate.me
                  </a>
                </div>
                {/* <div className={contactLine}>
                  <IconWorld size={20} className="text-secondary" />
                  <a
                    href="https://portfolio.erik-aouizerate.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    portfolio.erik-aouizerate.me
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          <div className="relative block ml-6 mr-6 md:ml-16 md:mr-10 pb-8 text-white/70 print:text-black md:block print:flex  print:mt-4 print:pb-4">
            <IconQuote
              size="5rem"
              className="hidden md:block print:hidden absolute -top-12 -left-12 text-secondary/20 rotate-180"
            />
            <p className="text-sm">
              Ingénieur passionné, j&apos;interviens à toutes les étapes
              d&apos;un projet — de la conception à la mise en production — en
              alliant excellence technique et vision produit. J&apos;aime
              résoudre des problèmes complexes, tout en gardant à l&apos;esprit
              l&apos;impact business et l&apos;expérience utilisateur. La
              communication est au cœur de mon approche, garantissant
              collaboration efficace, innovation et qualité durable.
            </p>
          </div>
        </header>
        <main className={cx("pt-2 bg-white h-full print:bg-white print:pt-0")}>
          <Section
            Icon={IconColorSwatch}
            title="Compétences"
            className={cx("animate-enter1  print:bg-white")}
            showAll={skillsActions.showAll}
            reset={skillsActions.reset}
            removeAll={skillsActions.removeAll}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-4 md:gap-[1px] pt-6">
              <Skill
                title="Développement"
                data={skills.dev}
                removeSkill={skillsActions.remove("dev")}
              />
              <Skill
                title="Ingénierie IA"
                data={skills.ia}
                removeSkill={skillsActions.remove("ia")}
              />
              <Skill
                title="DevOps"
                data={skills.devops}
                removeSkill={skillsActions.remove("devops")}
              />
              <Skill
                title="Cloud"
                data={skills.cloud}
                removeSkill={skillsActions.remove("cloud")}
              />
              {/* <Skill
                title="Transverse"
                data={skills.transverse}
                removeSkill={skillsActions.remove("transverse")}
              /> */}
            </div>
          </Section>
          <Section
            Icon={IconAerialLift}
            title="Expériences professionnelles"
            className="animate-enter1"
            showAll={jobsActions.showAll}
            reset={jobsActions.reset}
          >
            {jobs.map((job, index) => (
              <Job
                key={index}
                data={job}
                remove={() => jobsActions.remove(index)}
                addSkills={jobsActions.addSkills(job.tools)}
                toggleSmall={() => jobsActions.toggleSmall(index)}
              />
            ))}
          </Section>
          <Section
            Icon={IconSchool}
            title="Formations"
            className="animate-enter1"
          >
            <div className="print:pt-2 print:pb-2 pt-6 pb-6">
              {schoolsData.map((school, index) => (
                <div key={index} className="mb-2 last-of-type:mb-0">
                  <div className="float-left flex flex-col items-center -ml-14 ">
                    <div>{dayjs(school.year).format("YYYY")}</div>
                  </div>
                  <h3 className="text-[0.88rem] font-bold">
                    {`${school.title}`}{" "}
                    <span className="font-normal">{`– ${school.school}`}</span>
                  </h3>
                  <h4 className="text-[0.88rem] text-gray-700">
                    {school.subtitle}
                  </h4>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
      <div className="print:hidden">
        <div className="fixed bottom-0 flex flex-col m-4 ml-[calc(calc(calc(100vw-21cm)/2)+21cm)]">
          <IconShare
            className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            size={48}
          />
          <IconPrinter
            className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
            onClick={() => {
              setIsForPrint(true);
              setTimeout(() => {
                window.print();
              }, 0);
            }}
            size={48}
          />
          <a href="/Erik_Aouizerate_CV.pdf" download="Erik_Aouizerate_CV.pdf">
            <IconDownload
              className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
              // onClick={() => {
              //   setIsForPrint(false);
              //   setTimeout(() => {
              //     window.print();
              //   }, 0);
              // }}
              size={48}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
