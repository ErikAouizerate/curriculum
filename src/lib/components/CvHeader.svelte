<script lang="ts">
  import IconBrandGithub from "@tabler/icons-svelte/icons/brand-github";
  import IconBrandLinkedin from "@tabler/icons-svelte/icons/brand-linkedin";
  import IconDeviceMobile from "@tabler/icons-svelte/icons/device-mobile";
  import IconMail from "@tabler/icons-svelte/icons/mail";
  import IconQuote from "@tabler/icons-svelte/icons/quote";
  import IconWorld from "@tabler/icons-svelte/icons/world";
  import dayjs from "dayjs";

  import { profile } from "#lib/content/profile.js";
  import type { ContactKind } from "#lib/content/profile.js";

  interface Props {
    /** Leaves room above the title for the page's floating actions on narrow screens. */
    actionsSpace?: boolean;
  }

  let { actionsSpace = false }: Props = $props();

  const yearsOld = dayjs().diff(dayjs(profile.birthDate), "years");
  const experience = yearsOld - profile.experienceOffset;

  // Icon before the text on mobile, after it on desktop/print (right-aligned column).
  const contactLine = "flex items-center gap-2 md:flex-row-reverse print:flex-row-reverse";

  function isContact(kind: ContactKind, expected: ContactKind): boolean {
    return kind === expected;
  }
</script>

<header class="bg-primary/90 text-white">
  <div
    class="flex flex-col bg-primary p-6 justify-center items-center text-center [view-transition-name:cv-banner] {actionsSpace
      ? 'pt-20 sheet:pt-6 print:pt-6'
      : ''}"
  >
    <h1 class="text-white text-xl font-bold [view-transition-name:cv-title]">{profile.title}</h1>
    <h2 class="hidden md:inline print:inline text-white/70 font-medium">
      {profile.subtitle}
    </h2>
  </div>

  <div class="relative md:flex md:flex-row py-4 md:py-0 md:relative print:relative print:py-0">
    <div class="absolute right-4 md:left-0 md:block print:block print:left-2 mt-4 md:mt-0 ml-4">
      <img
        alt=""
        src="/avatar.webp"
        width="112"
        height="112"
        class="md:absolute print:absolute -top-5 rounded-full [view-transition-name:cv-avatar] min-w-24 min-h-24 max-w-28 max-h-28 object-cover"
      />
    </div>
    <div
      class="pl-4 md:pl-40 print:pl-40 py-6 px-4 print:pb-0 flex flex-col md:flex-row print:flex-row justify-between w-full md:gap-0 gap-4"
    >
      <div class="flex flex-col justify-start mt-6 md:mt-0 md:ml-4 print:mt-0 print:ml-6">
        <div class="font-bold text-2xl mb-4 w-fit [view-transition-name:cv-name]">{profile.name}</div>
        <div class="text-lg text-white/70">{yearsOld} ans</div>
        <div class="text-lg text-white/70">Expérience : {experience} années</div>
        <div class="text-lg text-white/70">{profile.english}</div>
      </div>
      <div class="flex flex-col text-base/tight gap-1 mt-2">
        {#each profile.contacts as contact (contact.kind)}
          <!-- `static/cv.js` shows the portfolio link of `/` once this phone line is scrolled to. -->
          <div class={contactLine} data-cv-anchor={contact.kind === "phone" ? "portfolio-link" : undefined}>
            {#if isContact(contact.kind, "phone")}
              <IconDeviceMobile size={20} class="text-secondary" />
            {:else if isContact(contact.kind, "mail")}
              <IconMail size={20} class="text-secondary" />
            {:else if isContact(contact.kind, "linkedin")}
              <IconBrandLinkedin size={20} class="text-secondary" />
            {:else if isContact(contact.kind, "github")}
              <IconBrandGithub size={20} class="text-secondary" />
            {:else}
              <IconWorld size={20} class="text-secondary" />
            {/if}
            <a href={contact.href} target="_blank" rel="noreferrer">{contact.label}</a>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div
    class="relative block mx-6 md:ml-16 md:mr-10 pb-8 text-white/70 md:block print:flex print:mt-4 print:pb-4"
  >
    <IconQuote
      size={80}
      class="hidden md:block print:hidden absolute -top-12 -left-12 text-secondary/20 rotate-180"
    />
    <p class="text-sm print:text-xs">{profile.summary}</p>
  </div>
</header>
