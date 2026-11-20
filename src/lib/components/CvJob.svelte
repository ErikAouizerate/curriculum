<script lang="ts">
  import {
    IconArrowsVertical,
    IconFilter,
    IconTextPlus,
    IconTrash,
  } from "@tabler/icons-svelte";

  import {
    formatMonth,
    formatYear,
    groupJobTools,
    jobDuration,
    toolBorder,
    type JobMode,
  } from "#lib/cv.js";
  import type { Job } from "#lib/content/types.js";

  interface Props {
    job: Job;
    mode: JobMode;
    editable?: boolean;
    onRemove?: () => void;
    onToggleSmall?: () => void;
    onAddSkills?: (keepCurrent: boolean) => void;
  }

  let {
    job,
    mode,
    editable = false,
    onRemove,
    onToggleSmall,
    onAddSkills,
  }: Props = $props();

  const duration = $derived(jobDuration(job));
  const groupedTools = $derived(groupJobTools(job.tools));
</script>

<div class="group/job pt-5 last-of-type:mb-0 break-inside-avoid-page">
  <div
    class="flex gap-1 items-center mt-1 print:float-left md:float-left md:flex-col print:flex-col print:gap-0 md:gap-0 print:-ml-14 md:ml-[4.2rem]"
  >
    {#if mode !== 2 && job.end}
      <div>{formatMonth(job.end)}</div>
    {/if}
    {#if mode !== 2 && job.end}
      <div class="tracking-tight print:text-vertical md:text-vertical">
        ·····
      </div>
    {/if}
    <div>{mode === 2 ? formatYear(job.start) : formatMonth(job.start)}</div>
  </div>

  <h3 class="print:text-md text-lg font-bold relative">
    {job.title}{duration}
    {#if editable}
      <div
        class="flex absolute right-0 top-0 invisible group-hover/job:visible bg-white"
      >
        {#if onToggleSmall}
          <button
            type="button"
            aria-label="Réduire ou déplier cette expérience"
            class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
            onclick={onToggleSmall}
          >
            <IconArrowsVertical size={28} />
          </button>
        {/if}
        {#if onAddSkills}
          <button
            type="button"
            aria-label="Ajouter les compétences de cette expérience"
            class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
            onclick={() => onAddSkills?.(true)}
          >
            <IconTextPlus size={28} />
          </button>
          <button
            type="button"
            aria-label="Remplacer les compétences par celles de cette expérience"
            class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
            onclick={() => onAddSkills?.(false)}
          >
            <IconFilter size={28} />
          </button>
        {/if}
        {#if onRemove}
          <button
            type="button"
            aria-label="Retirer cette expérience"
            class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
            onclick={onRemove}
          >
            <IconTrash size={28} />
          </button>
        {/if}
      </div>
    {/if}
  </h3>

  {#if mode !== 2}
    <p class="font-medium print:text-md">{job.description}</p>
    {#if job.tasks?.length}
      <ul class="list-disc ml-6 my-3 print:text-sm">
        {#each job.tasks as task, index (index)}
          <li class="font-light">{task}</li>
        {/each}
      </ul>
    {/if}
  {/if}

  <div class="print:text-xs flex flex-wrap items-center">
    {#each groupedTools as group, groupIndex (groupIndex)}
      <div class="flex flex-wrap">
        {#each group as tool (tool.label)}
          <div
            class="flex flex-wrap sm:flex-nowrap m-1 px-2 py-1 rounded-md text-xs border {toolBorder[
              tool.group
            ]}"
          >
            {tool.label}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
