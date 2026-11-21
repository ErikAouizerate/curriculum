<script lang="ts">
  import IconArrowBack from "@tabler/icons-svelte/icons/arrow-back";
  import IconArrowLeft from "@tabler/icons-svelte/icons/arrow-left";
  import IconArrowsVertical from "@tabler/icons-svelte/icons/arrows-vertical";
  import IconDownload from "@tabler/icons-svelte/icons/download";
  import IconFilter from "@tabler/icons-svelte/icons/filter";
  import IconPrinter from "@tabler/icons-svelte/icons/printer";
  import IconShare from "@tabler/icons-svelte/icons/share";
  import { onMount } from "svelte";

  import CvDocument from "#lib/components/CvDocument.svelte";
  import {
    applyJobSkills,
    defaultCvState,
    removeAllSkills,
    removeJob,
    removeSkill,
    resetJobs,
    resetSkills,
    showAll,
    showAllJobs,
    showAllSkills,
    toggleJobSmall,
    toView,
    type CvActions,
    type CvState,
  } from "#lib/cv.js";
  import { decodeCv, encodeCv } from "#lib/cv-codec.js";
  import { readCvCode, writeCvCode } from "#lib/cv-hash.js";

  let cv = $state<CvState>(defaultCvState());
  let ready = $state(false);
  let depth = $state(0);

  const view = $derived(toView(cv));

  function syncFromHash(): void {
    const code = readCvCode();
    cv = (code ? decodeCv(code) : null) ?? defaultCvState();
  }

  function commit(next: CvState): void {
    cv = next;
    depth += 1;
    writeCvCode(encodeCv(next), true, { cvDepth: depth });
  }

  const actions: CvActions = {
    showAllSkills: () => commit(showAllSkills(cv)),
    resetSkills: () => commit(resetSkills(cv)),
    removeAllSkills: () => commit(removeAllSkills(cv)),
    removeSkill: (index) => commit(removeSkill(cv, index)),
    showAllJobs: () => commit(showAllJobs(cv)),
    resetJobs: () => commit(resetJobs(cv)),
    removeJob: (index) => commit(removeJob(cv, index)),
    toggleSmall: (index) => commit(toggleJobSmall(cv, index)),
    addSkills: (jobIndex, keepCurrent) =>
      commit(applyJobSkills(cv, jobIndex, keepCurrent)),
  };

  function reset(): void {
    commit(defaultCvState());
  }

  function showEverything(): void {
    commit(showAll());
  }

  async function share(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      window.prompt("Copiez ce lien", window.location.href);
    }
  }

  onMount(() => {
    syncFromHash();
    // Normalise the URL so every visit has a shareable code.
    writeCvCode(encodeCv(cv), false, { cvDepth: 0 });
    ready = true;

    const onPopState = (event: PopStateEvent): void => {
      syncFromHash();
      depth = (event.state as { cvDepth?: number } | null)?.cvDepth ?? 0;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  const topActions =
    "print:hidden fixed z-10 top-0 right-0 flex flex-row gap-1 m-2 sheet:right-auto sheet:flex-col sheet:m-4 sheet:ml-[calc(calc(calc(100vw-21cm)/2)+21cm)]";
  const bottomActions =
    "print:hidden fixed z-10 bottom-0 left-1/2 -translate-x-1/2 flex flex-row gap-2 m-2 rounded-full bg-white shadow-lg sheet:left-auto sheet:translate-x-0 sheet:flex-col sheet:rounded-none sheet:bg-transparent sheet:shadow-none sheet:m-4 sheet:ml-[calc(calc(calc(100vw-21cm)/2)+21cm)]";
  const action =
    "rounded-full cursor-pointer hover:bg-stone-200 p-2 text-primary bg-white/70";
</script>

<svelte:head>
  <title>CV interactif — Erik Aouizerate</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="relative mb-6 pb-20 sheet:pb-0">
  <!-- The header is prerendered (it does not depend on the fragment), so it is painted at once
       and morphs from /portfolio; the content waits for the decoded `#cv=` state. -->
  <CvDocument view={view} editable actions={actions} showContent={ready} fullPage headerSpace />

  <div class={topActions}>
    <a
      href="/portfolio"
      data-sveltekit-reload
      aria-label="Revenir au portfolio"
      class="{action} [view-transition-name:nav-arrow]"
    >
      <IconArrowLeft size={40} />
    </a>
    <button
      type="button"
      aria-label="Tout afficher"
      class={action}
      onclick={showEverything}
    >
      <IconArrowsVertical size={40} />
    </button>
    <button
      type="button"
      aria-label="Réinitialiser le CV"
      class={action}
      onclick={reset}
    >
      <IconFilter size={40} />
    </button>
    <button
      type="button"
      aria-label="Annuler la dernière action"
      class="{action} disabled:opacity-30 disabled:cursor-auto"
      disabled={depth === 0}
      onclick={() => window.history.back()}
    >
      <IconArrowBack size={40} />
    </button>
  </div>

  <div class={bottomActions}>
    <button type="button" aria-label="Copier le lien" class={action} onclick={share}>
      <IconShare size={40} />
    </button>
    <button
      type="button"
      aria-label="Imprimer le CV"
      class={action}
      onclick={() => window.print()}
    >
      <IconPrinter size={40} />
    </button>
    <a
      href="/Erik_Aouizerate_CV.pdf"
      download="Erik_Aouizerate_CV.pdf"
      aria-label="Télécharger le CV en PDF"
      class={action}
    >
      <IconDownload size={40} />
    </a>
  </div>
</div>
