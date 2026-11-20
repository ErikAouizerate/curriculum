<script lang="ts">
  import { IconX } from "@tabler/icons-svelte";

  import type { CvSkillView } from "#lib/cv.js";

  interface Props {
    title: string;
    skills: CvSkillView[];
    editable?: boolean;
    onRemove?: (index: number) => void;
  }

  let { title, skills, editable = false, onRemove }: Props = $props();

  const visible = $derived(skills.filter((item) => item.selected));
</script>

<div class="flex flex-col items-center">
  <h3
    class="text-lg font-bold self-start md:self-center print:self-center m-2 mt-0 print:text-md"
  >
    {title}
  </h3>
  <div class="flex flex-col gap-2 h-full justify-start">
    {#each visible as item (item.index)}
      <div class="group/skill flex justify-between">
        <div class="flex">
          <div class="relative flex items-center">
            {#if editable && onRemove}
              <button
                type="button"
                aria-label={`Retirer ${item.skill.label}`}
                class="absolute inset-y-0 -left-1 z-10 invisible group-hover/skill:visible rounded-full cursor-pointer hover:bg-stone-200 p-1"
                onclick={() => onRemove(item.index)}
              >
                <IconX size={20} />
              </button>
            {/if}
            <img
              class="h-[25px] w-[25px] object-contain {editable ? 'group-hover/skill:invisible' : ''}"
              src={item.skill.icon}
              alt={item.skill.label}
              width="25"
              height="25"
              loading="lazy"
            />
          </div>
          <div class="ml-2 text-sm self-center print:text-xs">
            {#if item.skill.link}
              <a href={item.skill.link} target="_blank" rel="noreferrer">{item.skill.label}</a>
            {:else}
              {item.skill.label}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
