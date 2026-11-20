<script lang="ts">
  import {
    IconAerialLift,
    IconArrowsVertical,
    IconColorSwatch,
    IconFilter,
    IconSchool,
    IconTrash,
  } from "@tabler/icons-svelte";
  import type { Snippet } from "svelte";

  interface Props {
    icon: "skills" | "jobs" | "schools";
    title: string;
    editable?: boolean;
    onShowAll?: () => void;
    onReset?: () => void;
    onRemoveAll?: () => void;
    children: Snippet;
  }

  let {
    icon,
    title,
    editable = false,
    onShowAll,
    onReset,
    onRemoveAll,
    children,
  }: Props = $props();
</script>

<section class="items-center p-4 pt-0">
  <div class="flex ml-2 break-after-avoid">
    {#if icon === "skills"}
      <IconColorSwatch size={40} class="text-secondary" />
    {:else if icon === "jobs"}
      <IconAerialLift size={40} class="text-secondary" />
    {:else}
      <IconSchool size={40} class="text-secondary" />
    {/if}
    <div
      class="group/title flex items-center justify-between pl-4 border-b-2 border-black w-full ml-4 mr-6"
    >
      <h2 class="text-2xl font-bold print:text-lg">{title}</h2>
      {#if editable}
        <div class="invisible group-hover/title:visible flex gap-1">
          {#if onShowAll}
            <button
              type="button"
              aria-label="Tout afficher"
              class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onclick={onShowAll}
            >
              <IconArrowsVertical size={32} />
            </button>
          {/if}
          {#if onReset}
            <button
              type="button"
              aria-label="Réinitialiser la section"
              class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onclick={onReset}
            >
              <IconFilter size={32} />
            </button>
          {/if}
          {#if onRemoveAll}
            <button
              type="button"
              aria-label="Vider la section"
              class="rounded-full hover:bg-stone-200 cursor-pointer p-1"
              onclick={onRemoveAll}
            >
              <IconTrash size={32} />
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <div class="pl-6 print:pl-16 md:pl-[4.8rem] pr-6">
    {@render children()}
  </div>
</section>
