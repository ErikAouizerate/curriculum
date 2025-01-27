import {
  IconArrowsVertical,
  IconFilter,
  IconTextPlus,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import cx from "classnames";

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
        className={cx(" flex  gap-1  items-center mt-1", {
          "print:float-left md:float-left md:flex-col print:flex-col print:gap-0 md:gap-0 print:-ml-14 md:-ml-14":
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

      {!data.small && (
        <>
          <p className="mt-2 indent-6 print:text-md">{data.description}</p>
          <ul className="list-disc ml-6 my-2 print:text-sm">
            {data.tasks?.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
          {/* <p className="print:text-sm "><span className="font-bold">Outils</span> : {data.tools.join(", ")}</p> */}
          <div className="print:text-xs flex flex-wrap items-center">
            <span className="font-bold">Outils</span> :{" "}
            {data.tools.map((label, index) => {
              return (
                <div
                  key={`${label}_${index}`}
                  className="m-1 px-2 py-1 print:m-0 bg-secondary/20 rounded-md text-xs"
                >{`${label}`}</div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
