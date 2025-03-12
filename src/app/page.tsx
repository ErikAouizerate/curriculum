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
} from "@tabler/icons-react";

import useStore from "@/store";
import cx from "classnames";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

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
              }
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
          }
        )}
      >
        <header className="animate-enter1 bg-primary/90 text-white print:text-black print:bg-white">
          <div className="flex flex-col bg-primary py-6  justify-center items-center px-6 print:pb-0 text-center print:bg-white">
            <h1 className="text-white print:text-black text-xl font-bold ">
              DÉVELOPPEUR FULLSTACK DEVOPS SENIOR
            </h1>
            <h2 className="hidden md:inline print:inline text-white/50 print:text-black text-md font-medium">
              React | Python | Docker | Ansible
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
            <div className="hidden print:flex pl-4 md:pl-32 print:pl-32 print:py-2 py-6 px-4 md:flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-6">
              <div className="flex flex-col justify-start mt-6 md:mt-0 md:ml-4 print:mt-0 print:ml-6">
                <div className="font-bold text-2xl">Erik Aouizerate</div>
                <div className="text-lg text-white/50 print:text-black">
                  {yearsOld} ans
                </div>
              </div>
              <div className="flex flex-col text-lg leading-tight gap-1 mt-2">
                <div className="flex items-center justify-end gap-2">
                  <a href="tel:+330647197547">06 01 99 46 02 </a>
                  <IconDeviceMobile className=" text-secondary" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <a href="mailto:erik.aouizerate.pro@gmail.com">
                    erik.aouizerate.pro@gmail.com
                  </a>
                  <IconMail className=" text-secondary" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <a
                    href="https://erik-aouizerate.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    erik-aouizerate.me
                  </a>
                  <IconWorld className=" text-secondary" />
                </div>
              </div>
            </div>
            <div className="md:hidden print:hidden pl-4 md:pl-28 print:pl-32 py-4 px-4 flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-10">
              <div className="flex flex-col justify-start mt-6 md:mt-0">
                <div className="font-bold text-2xl">Erik Aouizerate</div>
                <div className="text-lg -mt-1 text-white/50 print:text-black">
                  {yearsOld} ans
                </div>
              </div>
              <div className="flex flex-col text-lg leading-tight gap-2 -ml-2">
                <div className="flex items-center justify-start gap-2">
                  <IconDeviceMobile className="text-secondary" />
                  <a href="tel:+330647197547">06 01 99 46 02 </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <IconMail className="text-secondary" />
                  <a href="mailto:erik.aouizerate.pro@gmail.com">
                    erik.aouizerate.pro@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <IconWorld className="text-secondary" />
                  <a
                    href="https://erik-aouizerate.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    erik-aouizerate.me
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden ml-16 mr-10 pb-8 text-white/70 print:text-black md:block print:flex  print:mt-4 print:pb-4">
            <IconQuote
              size="5rem"
              className="print:hidden absolute -top-12 -left-12 text-secondary/20 rotate-180"
            />
            <p className="text-sm">
              Développeur Fullstack DevOps passionné, j&apos;interviens à toutes
              les étapes d&apos;un projet, de la conception à la mise en
              production, en alliant expertise technique et vision produit.
              J&apos;aime relever des défis, optimiser les performances et
              fluidifier les processus de développement. La communication est au
              cœur de mon approche garantissant collaboration efficace,
              innovation et qualité durable.
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
                title="Frontend"
                data={skills.frontend}
                removeSkill={skillsActions.remove("frontend")}
              />
              <Skill
                title="Backend"
                data={skills.backend}
                removeSkill={skillsActions.remove("backend")}
              />
              <Skill
                title="DevOps"
                data={skills.infra}
                removeSkill={skillsActions.remove("infra")}
              />
              <Skill
                title="Transverse"
                data={skills.tools}
                removeSkill={skillsActions.remove("tools")}
              />
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
