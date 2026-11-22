<script lang="ts">
  import IconChevronLeft from "@tabler/icons-svelte/icons/chevron-left";
  import IconChevronRight from "@tabler/icons-svelte/icons/chevron-right";
  import IconX from "@tabler/icons-svelte/icons/x";

  import type { Project } from "#lib/content/projects.js";

  interface Props {
    id: string;
    project: Project;
  }

  let { id, project }: Props = $props();

  const arrow =
    "dialog-nav shrink-0 cursor-pointer rounded-full bg-white/90 p-2 text-primary shadow-md hover:bg-white";
</script>

<!-- Opened and closed by `static/cv.js` (data-cv-action), so it also works on the static `/`.
     The dialog itself is a transparent row: arrows outside the card (below it on phones), clicks on its empty area
     close it like the backdrop. -->
<dialog
  {id}
  aria-label="Présentation du projet {project.title}"
  class="project-dialog m-auto w-[min(70rem,96vw)] max-w-none items-center gap-x-12 gap-y-3 bg-transparent p-0 backdrop:bg-black/60 open:flex flex-wrap justify-center sm:flex-nowrap sm:gap-4"
>
  <!-- Carousel over every project dialog of the page; `static/cv.js` hides it when alone. -->
  <button type="button" data-cv-action="dialog-prev" aria-label="Visuel précédent" class={arrow}>
    <IconChevronLeft size={28} />
  </button>
  <div
    class="order-first min-w-0 basis-full overflow-hidden rounded-2xl bg-white shadow-2xl sm:order-0 sm:flex-1 sm:basis-auto"
  >
    <div class="flex items-center justify-between gap-4 bg-primary px-5 py-3 text-white">
      <h2 class="font-bold">{project.title}</h2>
      <button
        type="button"
        data-cv-action="close-dialog"
        aria-label="Fermer"
        class="cursor-pointer rounded-full p-1 hover:bg-white/10"
      >
        <IconX size={24} />
      </button>
    </div>
    <div class="max-h-[calc(90vh-7rem)] overflow-y-auto sm:max-h-[calc(90vh-3.5rem)]">
      <!-- Lazy: the image only loads once the dialog is shown. -->
      <img
        src={project.screenshot ?? project.image}
        alt="Présentation du projet {project.title}"
        width="1400"
        loading="lazy"
        class="h-auto w-full"
      />
    </div>
  </div>
  <button type="button" data-cv-action="dialog-next" aria-label="Visuel suivant" class={arrow}>
    <IconChevronRight size={28} />
  </button>
</dialog>

<style>
  .project-dialog[open],
  .project-dialog[open]::backdrop {
    animation: dialog-in 200ms ease-out;
  }

  /* Only the modal scrolls while it is open. */
  :global(html:has(dialog[open])) {
    overflow: hidden;
  }

  @keyframes dialog-in {
    from {
      opacity: 0;
    }
  }
</style>
