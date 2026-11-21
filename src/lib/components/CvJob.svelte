<script lang="ts">
  import IconArrowsVertical from "@tabler/icons-svelte/icons/arrows-vertical";
  import IconFilter from "@tabler/icons-svelte/icons/filter";
  import IconFold from "@tabler/icons-svelte/icons/fold";
  import IconTextPlus from "@tabler/icons-svelte/icons/text-plus";
  import IconTrash from "@tabler/icons-svelte/icons/trash";

  import {
    formatMonth,
    formatYear,
    groupJobTools,
    jobDuration,
    toolBorder,
    type JobMode,
  } from "#lib/cv.js";
  import ProjectDialog from "#lib/components/ProjectDialog.svelte";
  import type { Project } from "#lib/content/projects.js";
  import type { Job } from "#lib/content/types.js";

  interface Props {
    job: Job;
    mode: JobMode;
    /** Thumbnail shown in the empty margin left of the CV sheet (wide screens, never printed). */
    project?: Project;
    editable?: boolean;
    onRemove?: () => void;
    onToggleSmall?: () => void;
    onAddSkills?: (keepCurrent: boolean) => void;
  }

  let {
    job,
    mode,
    project,
    editable = false,
    onRemove,
    onToggleSmall,
    onAddSkills,
  }: Props = $props();

  const duration = $derived(jobDuration(job));
  // Touch screens have no hover: a short tap on the title toggles the job actions instead.
  let menuOpen = $state(false);

  function toggleMenu(event: MouseEvent) {
    if ((event as PointerEvent).pointerType === "touch") menuOpen = !menuOpen;
  }
  const groupedTools = $derived(groupJobTools(job.tools));
</script>

<!-- `static/cv.js` opens the project dialog; without JavaScript the link opens the presentation
     in a new tab. Never printed. -->
{#snippet thumbnail(project: Project, placement: string)}
  <a
    href={project.screenshot ?? project.image}
    target="_blank"
    rel="noreferrer"
    data-cv-action="open-dialog"
    data-dialog="project-{project.id}"
    aria-label="Voir le visuel du projet {project.title}"
    class="shine-border print:hidden overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg {placement}"
  >
    <img
      src={project.image}
      alt=""
      width="640"
      height="320"
      loading="lazy"
      class="aspect-2/1 w-full object-cover"
    />
    <span class="block px-3 py-2 text-sm font-semibold">{project.title}</span>
  </a>
{/snippet}

<div class="group/job pt-5 last-of-type:mb-0 break-inside-avoid-page">
  {#if project?.image}
    <!-- No positioned ancestor up to #cv-page: `right` places it outside the sheet while the
         static position keeps it level with this job. -->
    {@render thumbnail(
      project,
      "hidden min-[1400px]:block absolute right-[calc(100%+2.5rem)] mt-6 w-60",
    )}
    <ProjectDialog id="project-{project.id}" {project} />
  {/if}
  <div
    class="flex gap-1 items-center mt-1 print:float-left md:float-left md:flex-col print:flex-col print:gap-0 md:gap-0 print:-ml-14 md:-ml-14"
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

  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions (touch-only shortcut; keyboard and mouse users reach the buttons directly) -->
  <h3 class="text-lg font-bold relative" onclick={editable ? toggleMenu : undefined}>
    {job.title}{duration}
    {#if editable}
      <div
        class="flex absolute right-0 top-0 group-hover/job:visible bg-white {menuOpen
          ? 'visible'
          : 'invisible'}"
      >
        {#if onToggleSmall}
          <button
            type="button"
            aria-label={mode === 2 ? "Déplier cette expérience" : "Réduire cette expérience"}
            class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
            onclick={onToggleSmall}
          >
            {#if mode === 2}
              <IconArrowsVertical size={28} />
            {:else}
              <IconFold size={28} />
            {/if}
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
    <p class="font-medium">{job.description}</p>
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

  {#if project?.image}
    <!-- Below 1400px the margin is too narrow: the thumbnail closes the job instead. -->
    {@render thumbnail(project, "relative mx-auto mt-3 block max-w-sm min-[1400px]:hidden")}
  {/if}
</div>
