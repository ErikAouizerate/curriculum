<script lang="ts">
  import IconAerialLift from "@tabler/icons-svelte/icons/aerial-lift";
  import IconArrowsVertical from "@tabler/icons-svelte/icons/arrows-vertical";
  import IconColorSwatch from "@tabler/icons-svelte/icons/color-swatch";
  import IconFilter from "@tabler/icons-svelte/icons/filter";
  import IconSchool from "@tabler/icons-svelte/icons/school";
  import IconTrash from "@tabler/icons-svelte/icons/trash";
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
      class="group/title flex min-w-0 items-center justify-between pl-4 border-b-2 border-black w-full ml-4 mr-6"
    >
      <h2 class="min-w-0 text-2xl font-bold print:text-lg">{title}</h2>
      {#if editable}
        <div class="invisible group-hover/title:visible flex shrink-0 gap-1">
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
  <div class="px-6 print:pl-16 md:pl-[4.8rem]">
    {@render children()}
  </div>
</section>
