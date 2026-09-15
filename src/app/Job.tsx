import {
  IconArrowsVertical,
  IconFilter,
  IconTextPlus,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import cx from "classnames";

import objectLabels from "@/data/labels";
import dev from "@/data/dev";
import ia from "@/data/ia";
import cloud from "@/data/cloud";
import devops from "@/data/devops";
import tools from "@/data/tools";

const FRONTEND = "FRONTEND";
const BACKEND = "BACKEND";
const DEVOPS = "DEVOPS";
const TOOL = "TOOL";
const IA = "IA";
const CLOUD = "CLOUD";

const labelsOf = (item) =>
  item.match && item.match.length ? item.match : [item.label];
const inCategory = (data, tool) =>
  data.some((item) => labelsOf(item).includes(tool));

const toolsOrder = [...dev, ...ia, ...cloud, ...devops, ...tools].reduce(
  (acc, item, index) => {
    labelsOf(item).forEach((label) => {
      if (!(label in acc)) acc[label] = index;
    });
    return acc;
  },
  {},
);

const labels = Object.values(objectLabels);

const enhenceString = (value) =>
  value
    .split(" ")
    .map((word) => {
      const cleanedWord = word.replace(/[.,!?;]$/, "");

      if (labels.includes(cleanedWord)) {
        return word.replace(
          cleanedWord,
          `<strong class="custom-strong">${cleanedWord}</strong>`,
        );
      } else {
        return word;
      }
    })
    .join(" ");

export default function Skill({ data, remove, addSkills, toggleSmall }) {
  const searchParams = useSearchParams();

  const isEdit = !!searchParams.get("edit");

  let duration: any = dayjs(data.end).diff(dayjs(data.start), "month") + 1;
  if (duration > 16) {
    duration = Math.round(duration / 12) + " ans";
  } else {
    duration += " mois";
  }
  return (
    <div className="group/job pt-5 last-of-type:mb-0 break-inside-avoid-page">
      <div
        className={cx(" flex  gap-1 items-center mt-1", {
          "print:float-left md:float-left md:flex-col print:flex-col print:gap-0 md:gap-0 print:-ml-14 md:-ml-[4.2rem]": true,
        })}
      >
        {!data.small && (
          <div>{data.end && dayjs(data.end).format("MM/YY")}</div>
        )}

        {!data.small && data.end && (
          <div
            className={cx("tracking-tight ", {
              "print:text-vertical md:text-vertical": true,
            })}
          >
            ·····
          </div>
        )}
        <div>
          {data.small
            ? dayjs(data.start).format("YYYY")
            : dayjs(data.start).format("MM/YY")}
        </div>
      </div>
      <h3 className="print:text-md text-lg font-bold relative">
        {data.title}
        {duration}
        {isEdit && (
          <div className="flex absolute right-0 top-0 group/icon invisible group-hover/job:visible bg-white">
            <IconArrowsVertical
              className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onClick={toggleSmall}
              size={28}
            />
            <IconTextPlus
              className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onClick={() => addSkills(true)}
              size={28}
            />
            <IconFilter
              className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onClick={() => addSkills(false)}
              size={28}
            />
            <IconTrash
              className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onClick={remove}
              size={28}
            />
          </div>
        )}
      </h3>

      {!data.small && <Content data={data} />}
      <div className="print:text-xs flex flex-wrap items-center">
        {[...data.tools]
          .sort((a, b) => {
            return (
              (toolsOrder[a] ?? Number.MAX_SAFE_INTEGER) -
              (toolsOrder[b] ?? Number.MAX_SAFE_INTEGER)
            );
          })
          .reduce(
            (acc, tool) => {
              if (
                dev
                  .filter((item) => item.type === "frontend")
                  .map((item) => item.label)
                  .includes(tool)
              ) {
                acc[0].push({ label: tool, type: FRONTEND });
                return acc;
              }
              if (
                dev
                  .filter((item) => item.type === "backend")
                  .map((item) => item.label)
                  .includes(tool)
              ) {
                acc[1].push({ label: tool, type: BACKEND });
                return acc;
              }
              if (inCategory(ia, tool)) {
                acc[2].push({ label: tool, type: IA });
                return acc;
              }
              if (cloud.map((item) => item.label).includes(tool)) {
                acc[3].push({ label: tool, type: CLOUD });
                return acc;
              }
              if (inCategory(devops, tool)) {
                acc[4].push({ label: tool, type: DEVOPS });
                return acc;
              }
              if (tools.map((item) => item.label).includes(tool)) {
                acc[5].push({ label: tool, type: TOOL });
                return acc;
              }

              return acc;
            },
            [[], [], [], [], [], []],
          )
          .map((toolPerType, index) => {
            return (
              <div className="flex flex-wrap" key={`${index}`}>
                {toolPerType.map((tool, index) => {
                  return (
                    <div
                      key={index}
                      className={cx(
                        " flex flex-wrap sm:flex-nowrap m-1 px-2 py-1 rounded-md text-xs b border",
                        {
                          "border-[#fca311]": tool.type === FRONTEND,
                          "border-[#2a9d8f]": tool.type === BACKEND,
                          "border-[#d64550]": tool.type === IA,
                          "border-[#6C5CE7]":
                            tool.type === CLOUD || tool.type === DEVOPS,
                          "border-[#1a1a1a]": tool.type === TOOL,
                        },
                      )}
                    >{`${tool.label}`}</div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const Content = ({ data }) => {
  return (
    <>
      <p className=" font-medium print:text-md">{data.description}</p>
      <ul className="list-disc ml-6 my-3 print:text-sm">
        {data.tasks?.map((task, index) => {
          return (
            <li className="font-light" key={index}>
              {task}
            </li>
          );
        })}
      </ul>
      {/* <p className="print:text-sm "><span className="font-bold">Outils</span> : {data.tools.join(", ")}</p> */}
    </>
  );
};
