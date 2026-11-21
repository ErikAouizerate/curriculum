<script lang="ts">
  import IconArrowLeft from "@tabler/icons-svelte/icons/arrow-left";
  import IconDownload from "@tabler/icons-svelte/icons/download";
  import IconPrinter from "@tabler/icons-svelte/icons/printer";
  import IconShare from "@tabler/icons-svelte/icons/share";

  import CvDocument from "#lib/components/CvDocument.svelte";
  import { profile } from "#lib/content/profile.js";
  import { schools } from "#lib/content/schools.js";
  import { defaultCvState, skillCategories, toView } from "#lib/cv.js";
  import type { CategoryKey } from "#lib/cv.js";

  const view = toView(defaultCvState());

  const SITE = "https://www.erik-aouizerate.me";

  function contactHref(kind: "linkedin" | "github"): string {
    return profile.contacts.find((contact) => contact.kind === kind)?.href ?? "";
  }

  function defaultSkillLabels(key: CategoryKey): string[] {
    return (
      skillCategories
        .find((category) => category.key === key)
        ?.skills.filter((skill) => skill.default)
        .map((skill) => skill.label) ?? []
    );
  }

  // Balanced selection from the default skills, capped at 15 for `knowsAbout`.
  const knowsAbout = [
    ...defaultSkillLabels("dev").slice(0, 4),
    ...defaultSkillLabels("ia").slice(0, 4),
    ...defaultSkillLabels("devops").slice(0, 3),
    ...defaultSkillLabels("cloud").slice(0, 4),
  ];

  const alumniOf = [...new Set(schools.map((school) => school.school))].map((name) => ({
    "@type": "EducationalOrganization",
    name,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    url: `${SITE}/`,
    image: `${SITE}/avatar.webp`,
    email:
      profile.contacts
        .find((contact) => contact.kind === "mail")
        ?.href.replace(/^mailto:/, "") ?? "",
    sameAs: [contactHref("linkedin"), contactHref("github")].filter(Boolean),
    knowsAbout,
    alumniOf,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toulouse",
      addressCountry: "FR",
    },
    mainEntityOfPage: `${SITE}/`,
  };

  const jsonLdScript =
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</` +
    "script>";

  const topAction =
    "print:hidden fixed z-10 top-4 right-4 md:right-auto md:ml-[calc(calc(calc(100vw-21cm)/2)+21cm)] rounded-full bg-white/80 p-2 text-primary shadow-sm hover:bg-stone-200";
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
  <!-- Machine-readable Person data; the serialized JSON escapes `<` to stay inert. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLdScript}
</svelte:head>

<div class="relative mb-6 pb-20 md:pb-0">
  <CvDocument {view} />

  <!-- data-sveltekit-reload keeps a full page load in dev too, so the view transition runs. -->
  <a
    href="/portfolio"
    data-sveltekit-reload
    aria-label="Ouvrir le portfolio"
    class="{topAction} portfolio-shine rotate-180 [view-transition-name:nav-arrow]"
  >
    <IconArrowLeft size={40} />
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
