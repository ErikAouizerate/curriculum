<script lang="ts">
  import IconArrowLeft from "@tabler/icons-svelte/icons/arrow-left";

  import { profile } from "#lib/content/profile.js";

  import AskCv from "./AskCv.svelte";
</script>

<svelte:head>
  <title>Portfolio — Érik Aouizerate</title>
  <link rel="canonical" href="https://www.erik-aouizerate.me/portfolio" />
  <!-- Kept out of search indexes while the portfolio is being built. -->
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- The banner, avatar, title and name share their view-transition-name with CvHeader, so the browser
     morphs them from the CV header into this heading. -->
<header
  class="flex items-center justify-between gap-4 bg-primary pr-4 text-white [view-transition-name:cv-banner]"
>
  <a href="/" data-sveltekit-reload class="flex items-center gap-4 px-6 py-4 w-fit">
    <img
      alt=""
      src="/avatar.webp"
      width="56"
      height="56"
      class="size-14 rounded-full object-cover [view-transition-name:cv-avatar]"
    />
    <div class="flex flex-col">
      <span class="font-bold text-xl w-fit [view-transition-name:cv-name]">{profile.name}</span>
      <span class="text-xs text-white/70 w-fit [view-transition-name:cv-title]">
        {profile.title}
      </span>
    </div>
  </a>

  <nav>
    <a
      href="/"
      data-sveltekit-reload
      aria-label="Revenir au CV"
      class="block [view-transition-name:nav-arrow] rounded-full bg-white/80 p-2 text-primary shadow hover:bg-stone-200"
    >
      <IconArrowLeft size={40} />
    </a>
  </nav>
</header>

<main>
  <AskCv />
</main>
