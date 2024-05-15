import { IconX } from "@tabler/icons-react";
import Image from "next/image";

export default function Skill({ title, data, removeSkill }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold m-1 mt-0">{title}</h3>
      <div>
        {data.map((skill, index) => (
          <div className="group/skill flex justify-between mb-2" key={index}>
            <div className="flex">
              <div className="relative">
                <IconX
                  className="group/remove invisible rounded-full cursor-pointer hover:bg-stone-200 group-hover/skill:visible absolute p-1"
                  size={28}
                  onClick={() => removeSkill(index)}
                />
              </div>
              <Image
                className="group/icon visible group-hover/skill:invisible"
                alt={skill.label}
                src={skill.icon}
                width="25"
                height="auto"
              />
              <div className="ml-2 text-sm self-center">
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
