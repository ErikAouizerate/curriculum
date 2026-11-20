<script lang="ts">
  import {
    IconArrowRight,
    IconDownload,
    IconPrinter,
    IconShare,
  } from "@tabler/icons-svelte";

  import CvDocument from "#lib/components/CvDocument.svelte";
  import { defaultCvState, toView } from "#lib/cv.js";

  const view = toView(defaultCvState());

  const topAction =
    "print:hidden fixed z-10 top-4 right-4 md:right-auto md:ml-[calc(calc(calc(100vw-21cm)/2)+21cm)] rounded-full bg-white/80 p-2 text-primary shadow hover:bg-stone-200";
  const bottomActions =
    "print:hidden fixed z-10 bottom-0 left-1/2 -translate-x-1/2 flex flex-row gap-2 m-4 rounded-full bg-white shadow-lg md:left-auto md:translate-x-0 md:flex-col md:rounded-none md:bg-transparent md:shadow-none md:ml-[calc(calc(calc(100vw-21cm)/2)+21cm)]";
  const action = "rounded-full cursor-pointer hover:bg-stone-200 p-2 text-primary";
</script>

<svelte:head>
  <title>CV Érik Aouizerate</title>
  <link rel="canonical" href="https://www.erik-aouizerate.me/" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="CV Érik Aouizerate" />
  <meta
    property="og:description"
    content="Ingénieur logiciel senior — AI, Fullstack & DevOps. CV statique et version interactive."
  />
</svelte:head>

<div class="relative mb-6 pb-20 md:pb-0">
  <CvDocument {view} />

  <!-- Visually hidden for now; the 56x56 clickable area is kept. -->
  <a
    href="/studio"
    aria-label="Ouvrir la version interactive"
    class="{topAction} opacity-0 focus-visible:opacity-100"
  >
    <IconArrowRight size={40} />
  </a>

  <div class={bottomActions}>
    <button type="button" data-cv-action="share" aria-label="Copier le lien" class={action}>
      <IconShare size={40} />
    </button>
    <button type="button" data-cv-action="print" aria-label="Imprimer le CV" class={action}>
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
