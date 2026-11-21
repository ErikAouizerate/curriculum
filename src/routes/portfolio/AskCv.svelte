<script lang="ts">
  import IconArrowRight from "@tabler/icons-svelte/icons/arrow-right";
  import IconBrandGithub from "@tabler/icons-svelte/icons/brand-github";
  import IconPhoto from "@tabler/icons-svelte/icons/photo";
  import IconSend from "@tabler/icons-svelte/icons/send";
  import IconX from "@tabler/icons-svelte/icons/x";
  import { PUBLIC_TURNSTILE_SITE_KEY } from "$app/env/public";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  import CvDocument from "#lib/components/CvDocument.svelte";
  import {
    EventFilter,
    MAX_INPUT_LENGTH,
    splitLines,
    type AskEvent,
    type ModelEvent,
  } from "#lib/ask/events.js";
  import { jobs } from "#lib/content/jobs.js";
  import { projects, type Project } from "#lib/content/projects.js";
  import { skillCatalog, toView, type CvState } from "#lib/cv.js";

  import Scramble from "./Scramble.svelte";

  interface Turnstile {
    render: (
      container: HTMLElement,
      options: Record<string, unknown>,
    ) => string;
    reset: (widgetId: string) => void;
  }

  type SkillEvent = Extract<ModelEvent, { type: "skill" }>;
  type ProjectEvent = Extract<ModelEvent, { type: "project" }>;
  type JobEvent = Extract<ModelEvent, { type: "job" }>;
  type Phase = "idle" | "analyse" | "match" | "cv" | "done";

  const examples = [
    {
      label: "Une offre",
      value:
        "Nous recherchons un développeur fullstack senior TypeScript / React / Node.js, à l'aise avec Kubernetes, Terraform et l'intégration de LLM (RAG, agents). Une expérience Kotlin est un plus.",
    },
    {
      label: "Une question",
      value: "Quelle est son expérience en sécurité des agents IA ?",
    },
    { label: "Des mots-clés", value: "Python, FastAPI, Docker, AWS, MCP, Go" },
  ];

  const steps: { phase: Phase; label: string }[] = [
    { phase: "analyse", label: "Analyse" },
    { phase: "match", label: "Correspondance" },
    { phase: "cv", label: "CV sur mesure" },
  ];
  const order: Phase[] = ["idle", "analyse", "match", "cv", "done"];

  const levelStyle = {
    strong: "border-emerald-500 bg-emerald-50 text-emerald-900",
    partial: "border-secondary bg-amber-50 text-amber-900",
    missing: "border-dashed border-stone-400 bg-white text-stone-500",
  } as const;
  const levelLabel = {
    strong: "Maîtrisé",
    partial: "Proche",
    missing: "Absent",
  } as const;

  let input = $state("");
  let phase = $state<Phase>("idle");
  let sentences = $state<string[]>([]);
  let skills = $state<SkillEvent[]>([]);
  let matchedJobs = $state<JobEvent[]>([]);
  let matchedProjects = $state<ProjectEvent[]>([]);
  let cvHref = $state<string | null>(null);
  // Rebuilt from the streamed skills/jobs, so the CV preview grows while the answer arrives.
  let cvState = $state<CvState | null>(null);
  let filter = new EventFilter();
  const view = $derived(cvState ? toView(cvState) : null);

  // The CV is laid out at A4 width (21cm); scale it down to fit the 2/5 column side by side.
  const CV_WIDTH_PX = (21 / 2.54) * 96;
  const LG_BREAKPOINT_PX = 1024;
  let innerWidth = $state(0);
  let previewWidth = $state(0);
  const cvZoom = $derived(
    innerWidth >= LG_BREAKPOINT_PX &&
      previewWidth > 0 &&
      previewWidth < CV_WIDTH_PX
      ? previewWidth / CV_WIDTH_PX
      : 1,
  );
  let failure = $state<string | null>(null);

  let turnstileBox: HTMLDivElement | undefined = $state();
  let turnstileToken = $state<string | null>(null);
  let widgetId: string | null = null;

  const busy = $derived(phase !== "idle" && phase !== "done");
  const canSend = $derived(
    !busy &&
      input.trim().length > 0 &&
      (turnstileToken !== null || !PUBLIC_TURNSTILE_SITE_KEY),
  );

  // The last prompt and answer survive the full page loads to /studio and back, per tab only.
  const STORAGE_KEY = "portfolio:ask:v1";
  let received: AskEvent[] = [];
  let restored = false;

  function persist() {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ input, events: received }),
      );
    } catch {
      // Storage unavailable (private mode, blocked site data): the page still works.
    }
  }

  function restore() {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) ?? "null",
      ) as {
        input?: unknown;
        events?: unknown;
      } | null;
      if (typeof saved?.input === "string") input = saved.input;
      if (Array.isArray(saved?.events) && saved.events.length) {
        for (const event of saved.events as AskEvent[]) {
          if (event.type === "cv" && !event.href.startsWith("/studio#cv="))
            continue;
          apply(event);
        }
        phase = "done";
      }
    } catch {
      // Ignore unreadable or corrupted storage.
    }
    restored = true;
  }

  $effect(() => {
    void input;
    if (restored) persist();
  });

  const projectCard =
    "block w-full overflow-hidden rounded-xl bg-white shadow-sm transition";

  // Client projects have no public link: their presentation opens in a native modal dialog.
  let shownProject = $state<Project | null>(null);
  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (shownProject && !dialog.open) dialog.showModal();
    if (!shownProject && dialog.open) dialog.close();
  });

  function reached(step: Phase): boolean {
    return order.indexOf(phase) >= order.indexOf(step);
  }

  onMount(() => {
    restore();
    if (!PUBLIC_TURNSTILE_SITE_KEY || !turnstileBox) return;
    const box = turnstileBox;
    const win = window as unknown as {
      turnstile?: Turnstile;
      onTurnstileReady?: () => void;
    };
    win.onTurnstileReady = () => {
      widgetId =
        win.turnstile?.render(box, {
          sitekey: PUBLIC_TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          callback: (token: string) => (turnstileToken = token),
          "expired-callback": () => (turnstileToken = null),
        }) ?? null;
    };
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady";
    script.async = true;
    document.head.append(script);
  });

  function resetTurnstile() {
    // Tokens are single-use: ask for a fresh one after every request.
    turnstileToken = null;
    const turnstile = (window as unknown as { turnstile?: Turnstile })
      .turnstile;
    if (widgetId && turnstile) turnstile.reset(widgetId);
  }

  function apply(event: AskEvent) {
    received.push(event);
    switch (event.type) {
      case "text":
        sentences.push(event.delta);
        break;
      case "skill":
        phase = "match";
        skills.push(event);
        filter.accept(event);
        cvState = filter.cvState();
        break;
      case "job":
        phase = "match";
        matchedJobs.push(event);
        filter.accept(event);
        cvState = filter.cvState() ?? cvState;
        break;
      case "project":
        phase = "match";
        matchedProjects.push(event);
        break;
      case "cv":
        phase = "cv";
        cvHref = event.href;
        break;
      case "error":
        failure = event.message;
        break;
    }
  }

  async function ask(event: SubmitEvent) {
    event.preventDefault();
    if (!canSend) return;

    phase = "analyse";
    sentences = [];
    skills = [];
    matchedJobs = [];
    matchedProjects = [];
    cvHref = null;
    cvState = null;
    filter = new EventFilter();
    received = [];
    failure = null;

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ input, token: turnstileToken }),
      });
      if (!response.ok || !response.body) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        failure =
          body?.message ?? "L'assistant est indisponible pour le moment.";
        return;
      }

      // getReader() rather than for-await: Safari cannot iterate a ReadableStream.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { lines, rest } = splitLines(buffer);
        buffer = rest;
        for (const line of lines) apply(JSON.parse(line) as AskEvent);
      }
    } catch {
      failure = "La connexion a été interrompue.";
    } finally {
      phase = "done";
      persist();
      resetTurnstile();
    }
  }
</script>

<svelte:window bind:innerWidth />

{#snippet projectBody(project: Project, why: string)}
  {#if project.image}
    <img
      src={project.image}
      alt=""
      width="640"
      height="320"
      loading="lazy"
      class="aspect-2/1 w-full object-cover"
    />
  {/if}
  <span class="block p-4">
    <span class="flex items-center gap-2 font-semibold">
      {#if project.url?.startsWith("https://github.com/")}
        <IconBrandGithub size={18} />
      {:else if project.screenshot}
        <IconPhoto size={18} />
      {/if}
      {project.title}
    </span>
    <span class="mt-1 block text-sm text-stone-600">{why}</span>
  </span>
{/snippet}

<!-- Prompt on the left 3/5 (from lg); the right 2/5 holds the tailored CV, scaled to fit. -->
<section
  class="flex flex-col gap-10 px-6 py-12 text-primary lg:flex-row lg:items-start"
>
  <div class="w-full shrink-0 lg:w-2/5">
    <h1 class="text-3xl font-bold">
      Mon profil est-il fait pour votre poste ?
    </h1>
    <p class="mt-2 text-stone-600">
      Collez une fiche de poste, posez une question ou listez des mots-clés :
      l'assistant répond, met en regard les compétences, cite les projets GitHub
      utiles et génère un CV adapté.
    </p>

    <form onsubmit={ask} class="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <textarea
        bind:value={input}
        maxlength={MAX_INPUT_LENGTH}
        rows="5"
        placeholder="Ex. : « Lead dev TypeScript, Kubernetes, LLM… »"
        aria-label="Votre offre, question ou mots-clés"
        class="w-full resize-y rounded-lg border border-stone-300 p-3 focus:border-primary focus:outline-none"
      ></textarea>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        {#each examples as example (example.label)}
          <button
            type="button"
            onclick={() => (input = example.value)}
            class="rounded-full border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100"
          >
            {example.label}
          </button>
        {/each}
        <span class="ml-auto text-xs text-stone-500"
          >{input.length}/{MAX_INPUT_LENGTH}</span
        >
        <button
          type="submit"
          disabled={!canSend}
          class="flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          <IconSend size={18} /> Analyser
        </button>
      </div>
      <div bind:this={turnstileBox} class="mt-2"></div>
    </form>

    {#if phase !== "idle"}
      <ol class="mt-8 flex gap-2 text-sm" aria-label="Progression">
        {#each steps as step (step.phase)}
          <li
            class="flex-1 rounded-full px-3 py-1 text-center transition-colors duration-500 {reached(
              step.phase,
            )
              ? 'bg-primary text-white'
              : 'bg-stone-200 text-stone-500'}"
          >
            {step.label}
          </li>
        {/each}
      </ol>
    {/if}

    {#if failure}
      <p role="alert" class="mt-6 rounded-lg bg-red-50 p-3 text-red-800">
        {failure}
      </p>
    {/if}

    {#if sentences.length}
      <div class="mt-6 space-y-2 text-lg/relaxed" aria-live="polite">
        {#each sentences as sentence, i (i)}
          <p in:fade={{ duration: 300 }}>{sentence}</p>
        {/each}
      </div>
    {/if}

    {#if skills.length}
      <h2 class="mt-8 font-semibold">Compétences</h2>
      <ul class="mt-3 flex flex-wrap gap-2">
        {#each skills as skill, i (i)}
          {@const catalogSkill =
            skill.index === undefined ? null : skillCatalog[skill.index]}
          <li
            in:fly={{ y: 12, duration: 350 }}
            title={levelLabel[skill.level]}
            class="flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm {levelStyle[
              skill.level
            ]}"
          >
            {#if catalogSkill}
              <img
                src={catalogSkill.icon}
                alt=""
                width="18"
                height="18"
                class="size-[18px] object-contain"
              />
              <span class="font-medium">{catalogSkill.label}</span>
              {#if catalogSkill.label.toLowerCase() !== skill.term.toLowerCase()}
                <span class="opacity-70">← {skill.term}</span>
              {/if}
            {:else}
              <span class="line-through decoration-1">{skill.term}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}

    {#if matchedJobs.length}
      <h2 class="mt-8 font-semibold">Missions pertinentes</h2>
      <ul class="mt-3 space-y-1 text-stone-700">
        {#each matchedJobs as job (job.index)}
          <li in:fly={{ x: -12, duration: 350 }}>
            {jobs[job.index].title.replace(/\s+–\s*$/, "")}
            <span class="text-stone-500"
              >({jobs[job.index].start.slice(0, 4)})</span
            >
          </li>
        {/each}
      </ul>
    {/if}

    {#if matchedProjects.length}
      <h2 class="mt-8 font-semibold">Projets</h2>
      <div class="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {#each matchedProjects as match (match.id)}
          {@const project = projects.find((item) => item.id === match.id)}
          {#if project}
            {#if project.url}
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                in:fly={{ y: 16, duration: 400 }}
                class="{projectCard} hover:-translate-y-0.5 hover:shadow-md"
              >
                {@render projectBody(project, match.why)}
              </a>
            {:else if project.screenshot}
              <button
                type="button"
                onclick={() => (shownProject = project)}
                in:fly={{ y: 16, duration: 400 }}
                class="{projectCard} cursor-pointer text-left hover:-translate-y-0.5 hover:shadow-md"
              >
                {@render projectBody(project, match.why)}
              </button>
            {:else}
              <div in:fly={{ y: 16, duration: 400 }} class={projectCard}>
                {@render projectBody(project, match.why)}
              </div>
            {/if}
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <aside
    bind:clientWidth={previewWidth}
    class="cv-preview min-w-0 flex-1 overflow-x-clip"
    aria-label="CV adapté"
  >
    <!-- Always present: the plain studio first, the tailored CV once it exists. -->
    <a
      href={cvHref ?? "/studio"}
      data-sveltekit-reload
      class="mb-3 flex items-center justify-between gap-4 rounded-2xl bg-primary px-5 py-3 text-white shadow-lg hover:bg-primary/90"
    >
      <span>
        <!-- Both labels share one grid cell, so the swap is a real cross-fade without a jump. -->
        <span class="grid font-bold">
          {#key cvHref}
            <span
              class="col-start-1 row-start-1"
              in:fade={{ duration: 400, delay: 150 }}
              out:fade={{ duration: 250 }}
            >
              {cvHref ? "Ouvrir ce CV" : "Composer mon CV !"}
            </span>
          {/key}
        </span>
        <span class="block text-sm text-white/70">
          Naviguez parmi mes compétences et missions
        </span>
      </span>
      <IconArrowRight size={28} class="shrink-0 text-secondary" />
    </a>

    {#if view}
      <div in:fly={{ x: 48, duration: 500 }} class="mx-auto md:w-fit">
        <div class="shadow-lg" style:zoom={cvZoom}>
          <CvDocument {view} />
        </div>
      </div>
    {:else}
      <!-- Hero from the previous portfolio, kept until the tailored CV exists. -->
      <div
        class="relative flex min-h-128 flex-col items-center justify-center overflow-hidden rounded-2xl bg-primary px-6 py-16 text-white shadow-lg"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(252_163_17/0.18),transparent_60%)] {busy
            ? 'animate-pulse'
            : ''}"
        ></div>
        <p class="sr-only">
          Ingénieur senior fullstack, IA et DevOps, engagé et pédagogue.
        </p>
        <div
          class="relative flex flex-col gap-5 text-4xl font-semibold capitalize md:text-5xl"
        >
          <div in:fly={{ y: 20, duration: 500, delay: 400 }}>
            <Scramble values={["ingénieur", "développeur", "freelance"]} />
          </div>
          <div
            in:fly={{ y: 20, duration: 500, delay: 500 }}
            class="text-cyan-400"
          >
            <Scramble
              values={["senior", "tech lead", "architecte", "agentique"]}
            />
          </div>
          <div
            in:fly={{ y: 20, duration: 400, delay: 600 }}
            class="text-secondary"
          >
            <Scramble
              values={[
                "fullstack",
                "IA",
                "devops",
                "backend",
                "frontend",
                "typescript",
                "react",
                "node",
                "python",
                "cloud",
                "kubernetes",
              ]}
            />
          </div>
          <div
            in:fly={{ y: 20, duration: 300, delay: 800 }}
            class="text-emerald-400"
          >
            <Scramble
              values={[
                "engagé",
                "pédagogue",
                "efficace",
                "curieux",
                "passionné",
                "créatif",
                "autonome",
              ]}
            />
          </div>
        </div>
        <p class="relative mt-12 h-5 text-sm text-white/60" aria-live="polite">
          {busy ? "Construction du CV adapté…" : ""}
        </p>
      </div>
    {/if}
  </aside>
</section>

<dialog
  bind:this={dialog}
  onclose={() => (shownProject = null)}
  onclick={(event) => event.target === dialog && dialog?.close()}
  aria-label={shownProject
    ? `Présentation du projet ${shownProject.title}`
    : undefined}
  class="project-dialog m-auto w-[min(64rem,92vw)] overflow-hidden rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/60"
>
  {#if shownProject}
    <div
      class="flex items-center justify-between gap-4 bg-primary px-5 py-3 text-white"
    >
      <h2 class="font-bold">{shownProject.title}</h2>
      <button
        type="button"
        aria-label="Fermer"
        onclick={() => dialog?.close()}
        class="rounded-full p-1 hover:bg-white/10"
      >
        <IconX size={24} />
      </button>
    </div>
    <div class="max-h-[calc(90vh-3.5rem)] overflow-y-auto">
      <img
        src={shownProject.screenshot}
        alt="Présentation du projet {shownProject.title}"
        width="1400"
        class="h-auto w-full"
      />
    </div>
  {/if}
</dialog>

<style>
  /* The preview reuses CvHeader, whose names would clash with the page header and cancel the
     cross-document view transitions. */
  .cv-preview :global(*) {
    view-transition-name: none !important;
  }

  .project-dialog[open] {
    animation: dialog-in 200ms ease-out;
  }

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
