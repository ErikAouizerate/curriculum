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
import backend from "@/data/backend";
import frontend from "@/data/frontend";
import infra from "@/data/infra";
import tools from "@/data/tools";

const BACKEND = "BACKEND";
const FRONTEND = "FRONTEND";
const INFRA = "INFRA";
const TOOL = "TOOL";

const toolsOrder = frontend
  .concat(...backend)
  .concat(...infra)
  .concat(...tools)
  .reduce((acc, item, index) => {
    acc[item.label] = index;
    return acc;
  }, {});

const labels = Object.values(objectLabels);

const enhenceString = (value) =>
  value
    .split(" ")
    .map((word) => {
      const cleanedWord = word.replace(/[.,!?;]$/, "");

      if (labels.includes(cleanedWord)) {
        return word.replace(
          cleanedWord,
          `<strong class="custom-strong">${cleanedWord}</strong>`
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
          "print:float-left md:float-left md:flex-col print:flex-col print:gap-0 md:gap-0 print:-ml-14 md:-ml-[4.2rem]":
            true,
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
        {data.tools
          .sort((a, b) => {
            return toolsOrder[a] - toolsOrder[b];
          })
          .reduce(
            (acc, tool) => {
              if (frontend.map((item) => item.label).includes(tool)) {
                acc[0].push({ label: tool, type: FRONTEND });
              }
              if (backend.map((item) => item.label).includes(tool)) {
                acc[1].push({ label: tool, type: BACKEND });
              }
              if (infra.map((item) => item.label).includes(tool)) {
                acc[2].push({ label: tool, type: INFRA });
              }
              if (tools.map((item) => item.label).includes(tool)) {
                acc[3].push({ label: tool, type: TOOL });
              }

              return acc;
            },
            [[], [], [], []]
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
                          "border-secondary": tool.type === FRONTEND,
                          "border-[#2a9d8f]": tool.type === BACKEND,
                          "border-[#d64550]": tool.type === INFRA,
                          "border-[#1a1a1a]": tool.type === TOOL,
                        }
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
      <p
        dangerouslySetInnerHTML={{
          __html: data.description,
        }}
        className=" font-medium print:text-md"
      ></p>
      <ul className="list-disc ml-6 my-3 print:text-sm">
        {data.tasks?.map((task, index) => {
          return (
            <li
              className="font-light"
              dangerouslySetInnerHTML={{ __html: task }}
              key={index}
            />
          );
        })}
      </ul>
      {/* <p className="print:text-sm "><span className="font-bold">Outils</span> : {data.tools.join(", ")}</p> */}
    </>
  );
};
