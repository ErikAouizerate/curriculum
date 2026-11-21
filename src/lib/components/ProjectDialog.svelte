<script lang="ts">
  import IconX from "@tabler/icons-svelte/icons/x";

  import type { Project } from "#lib/content/projects.js";

  interface Props {
    id: string;
    project: Project;
  }

  let { id, project }: Props = $props();
</script>

<!-- Opened and closed by `static/cv.js` (data-cv-action), so it also works on the static `/`. -->
<dialog
  {id}
  aria-label="Présentation du projet {project.title}"
  class="project-dialog m-auto w-[min(64rem,92vw)] overflow-hidden rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/60"
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
  <div class="max-h-[calc(90vh-3.5rem)] overflow-y-auto">
    <!-- Lazy: the image only loads once the dialog is shown. -->
    <img
      src={project.screenshot ?? project.image}
      alt="Présentation du projet {project.title}"
      width="1400"
      loading="lazy"
      class="h-auto w-full"
    />
  </div>
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
