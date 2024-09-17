import { IconFilter, IconTextPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function Skill({ data, remove, addSkills }) {
  let duration: any = dayjs(data.end).diff(dayjs(data.start), "month") + 1;
  if (duration > 16) {
    duration = Math.round(duration / 12) + " ans";
  } else {
    duration += " mois";
  }
  return (
    <div className="group/job pt-5 last-of-type:mb-0 break-inside-avoid-page">
      <div className="float-left flex flex-col items-center -ml-14 mt-1">
        <div>{dayjs(data.start).format("MM/YY")}</div>
        <div className="text-vertical tracking-tight ">·····</div>
        <div>{data.end && dayjs(data.end).format("MM/YY")}</div>
      </div>
      <h3 className="print:text-md text-lg font-bold print:md">
        {data.title}
        {duration}
        <div className="flex float-right group/icon invisible group-hover/job:visible">
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
      </h3>
      <p className="indent-6 print:text-sm font-semibold">{data.description}</p>
      <ul className="list-disc ml-6 my-2 print:text-sm">
        {data.tasks?.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      {/* <p className="print:text-sm "><span className="font-bold">Outils</span> : {data.tools.join(", ")}</p> */}
      <div className="print:text-xs flex flex-wrap items-center"><span className="font-bold">Outils</span> : {data.tools.map((label, index) => {
        return (
          <div key={`${label}_${index}`} className="m-1 px-2 py-1 bg-secondary/20 rounded-md">{`${label}`}</div>
        )
      }) }</div>
    </div>
  );
}
