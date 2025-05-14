import { IconX } from "@tabler/icons-react";
import cx from "classnames";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Skill({ title, data, removeSkill }) {
  const searchParams = useSearchParams();

  const isEdit = !!searchParams.get("edit");

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold self-start md:self-center print:self-center m-2 mt-0 print:text-md">
        {title}
      </h3>
      <div className="flex flex-col h-full justify-between">
        {data.map((skill, index) => (
          <div className="group/skill flex justify-between mb-2" key={index}>
            <div className="flex">
              {isEdit && (
                <div className="relative">
                  <IconX
                    className="group/remove invisible rounded-full cursor-pointer hover:bg-stone-200 group-hover/skill:visible absolute p-1"
                    size={28}
                    onClick={() => removeSkill(index)}
                  />
                </div>
              )}
              <Image
                className={cx("group/icon visible", {
                  ["group-hover/skill:invisible"]: isEdit,
                })}
                alt={skill.label}
                src={skill.icon}
                width="25"
                height="auto"
              />
              <div className="ml-2 text-sm self-center print:text-xs">
                {skill.link ? (
                  <a href={skill.link} target="_blank" rel="noreferrer">
                    {skill.label}
                  </a>
                ) : (
                  skill.label
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
