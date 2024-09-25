"use client";

import Image from "next/image";
import avatar from "../../public/avatar.png";
import dayjs from "dayjs";
import Section from "./Section";
import Skill from "./Skill";
import Job from "./Job";
import schoolsData from "@/data/schools";


import {  IconAerialLift,
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
  IconQuote,} from "@tabler/icons-react"

import useStore from "@/store";
import cx from "classnames";
import { useState } from "react";

export default function Page() {
  const yearsOld = dayjs().diff(dayjs("1987-05-23"), "years");

  const skills = useStore((state) => state.data.skills);
  const jobs = useStore((state) => state.data.jobs);
  const skillsActions = useStore((state) => state.skillsActions);
  const jobsActions = useStore((state) => state.jobsActions);

  const reset = useStore((state) => state.reset);
  const showAll = useStore((state) => state.showAll);
  const hasHistory = useStore((state) => state.history.length);

  const undo = useStore((state) => state.undo);

  const [isForPrint, setIsForPrint] = useState(false);

  return (
    <div
      className={cx("relative mb-6", {
        // ["print:grayscale"]: isForPrint,
      })}
    >
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
          className={cx("rounded-full cursor-pointer hover:bg-stone-200 p-2", {
            ["text-stone-300"]: !hasHistory,
            ["hover:bg-inherit"]: !hasHistory,
            ["cursor-auto"]: !hasHistory,
          })}
          onClick={undo}
          size={48}
        />
      </div>
      <div
        className={cx("md:w-[21cm] m-auto bg-stone-100 min-h-[29.7cm]", {
          ["print:bg-white"]: isForPrint,
        })}
      >
        <header className="animate-enter1 bg-primary/90 text-white  ">
          <div className="flex flex-col bg-primary py-6  justify-center items-center px-6 text-center ">
            <h1 className="text-white text-xl font-bold ">
             DEVELOPPEUR FULL STACK SENIOR{" "}
            </h1>
            <h2 className="hidden md:inline print:inline text-white/50 text-md font-medium">
              Ingénieur en informatique
            </h2>
          </div>
          <div className="flex md:relative print:relative py-4 md:py-0 print:py-0">
            <div className="mt-4 md:mt-0 ml-4">
              <Image
                alt="Photo du profil"
                src={avatar}
                className="md:absolute print:absolute -top-5 rounded-full min-w-24 min-h-24 max-w-28 max-h-28 object-cover"
              />
            </div>
            <div className="hidden print:flex pl-4 md:pl-28 print:pl-32 py-6 px-4 md:flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-6">
              <div className="flex flex-col justify-start mt-6 md:mt-0 md:ml-4 print:mt-0">
                <div className="font-bold text-2xl">Julien Faucher</div>
                <div className="text-lg text-white/50">{yearsOld} ans</div>
              </div>
              <div className="flex flex-col text-lg leading-tight gap-1 mt-2">
                <div className="flex items-center justify-end gap-2">
                  <a href="tel:+330647197547">06 47 19 75 47 </a>
                  <IconDeviceMobile className=" text-secondary" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <a href="mailto:julien.faucher@mintset.io">
                    julien.faucher@mintset.io
                  </a>
                  <IconMail className=" text-secondary" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <a
                    href="https://julien-faucher.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    julien-faucher.me
                  </a>
                  <IconWorld className=" text-secondary" />
                </div>
              </div>
            </div>
            <div className="md:hidden print:hidden pl-4 md:pl-28 print:pl-32 py-6 px-4 flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-10">
              <div className="flex flex-col justify-start mt-6 md:mt-0">
                <div className="font-bold text-2xl">Julien Faucher</div>
                <div className="text-lg -mt-1 text-white/50">{yearsOld} ans</div>
              </div>
              <div className="flex flex-col text-lg leading-tight gap-2 -ml-2">
                <div className="flex items-center justify-start gap-2">
                  <IconDeviceMobile className="text-secondary" />
                  <a href="tel:+330647197547">06 47 19 75 47 </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <IconMail className="text-secondary" />
                  <a href="mailto:julien.faucher@mintset.io">
                    julien.faucher@mintset.io
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <IconWorld className="text-secondary" />
                  <a
                    href="https://julien-faucher.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    julien-faucher.me
                  </a>
                </div>
              </div>
            </div>
            
          </div>
                    
          <div className="relative hidden ml-24 mr-10 pb-6 text-white/50 md:block print:flex ">
            <IconQuote size="5rem" className="absolute -top-8 -left-14 text-secondary/20 rotate-180" />
            <p className="text-md">{`Je suis full stack développeur passionné par les solutions de type SaaS. J'aime développer des produits numériques simples qui répondent à des problématiques complexes.`}</p>
          </div>
        </header>
        <main className={cx("pt-2 bg-stone-100 h-full print:bg-white")}>
          <Section
            Icon={IconColorSwatch}
            title="Compétences"
            className={cx("animate-enter1  print:bg-white")}
            showAll={skillsActions.showAll}
            reset={skillsActions.reset}
            removeAll={skillsActions.removeAll}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-[1px] pt-6">
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
                  <h3 className="text-[0.88rem] font-bold">{school.title}</h3>
                  <h4 className="text-[0.88rem] text-gray-700">{school.subtitle}</h4>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
      <div className="print:hidden">
        <div className="absolute -z-10 top-[29.7cm] w-full border border-dashed border-1"></div>
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
          <IconDownload
            className="rounded-full cursor-pointer hover:bg-stone-200 p-2"
            onClick={() => {
              setIsForPrint(false);
              setTimeout(() => {
                window.print();
              }, 0);
            }}
            size={48}
          />
        </div>
      </div>
    </div>
  );
}