import { IconArrowsVertical, IconFilter, IconTrash } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

export default function Section({
  Icon,
  title,
  children,
  className,
  showAll = null,
  reset = null,
  removeAll = null,
}) {
  const searchParams = useSearchParams();

  const isEdit = !!searchParams.get("edit");

  return (
    <section className={"items-center p-4 pb-0 " + className}>
      <div className="flex ml-2 break-after-avoid">
        <Icon size={40} className="text-secondary" />
        <div className="group/title flex items-center justify-between pl-4 border-b-2 border-black w-full ml-4 mr-6">
          <h2 className="text-2xl font-bold print:text-lg">{title}</h2>
          {isEdit && (
            <div className="group/icon invisible group-hover/title:visible flex gap-1">
              {showAll && (
                <IconArrowsVertical
                  className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
                  onClick={showAll}
                  size={32}
                />
              )}
              {reset && (
                <IconFilter
                  className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
                  onClick={reset}
                  size={32}
                />
              )}
              {removeAll && (
                <IconTrash
                  className="rounded-full hover:bg-stone-200 cursor-pointer p-1"
                  onClick={removeAll}
                  size={32}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="pl-6 print:pl-16 md:pl-[4.8rem] pr-6">{children}</div>
    </section>
  );
}
