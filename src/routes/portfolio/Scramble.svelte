<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    values: string[];
    /** Pause between two words, randomised so stacked scrambles never change in sync. */
    minDelay?: number;
    maxDelay?: number;
  }

  let { values, minDelay = 2000, maxDelay = 5000 }: Props = $props();

  const GLYPHS = "abcdefghijklmnopqrstuvwxyzéè0123456789<>/{}[]#$%&*+=";
  const TICK_MS = 35;
  const SCRAMBLED_TICKS = 3;

  // svelte-ignore state_referenced_locally
  let text = $state(values[0]);

  function randomGlyph(): string {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  onMount(() => {
    if (values.length < 2) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let wait: ReturnType<typeof setTimeout>;
    let tick: ReturnType<typeof setInterval> | undefined;

    // Reveals the next word left to right; letters not yet settled cycle through random glyphs.
    function scrambleTo(target: string) {
      if (reduceMotion) {
        text = target;
        return;
      }
      const length = Math.max(text.length, target.length);
      let frame = 0;
      clearInterval(tick);
      tick = setInterval(() => {
        frame += 1;
        const settled = Math.floor(frame / SCRAMBLED_TICKS);
        text = Array.from({ length }, (_, i) =>
          i < settled ? (target[i] ?? "") : i < target.length ? randomGlyph() : "",
        ).join("");
        if (settled >= length) {
          clearInterval(tick);
          text = target;
        }
      }, TICK_MS);
    }

    function schedule() {
      wait = setTimeout(
        () => {
          index = (index + 1) % values.length;
          scrambleTo(values[index]);
          schedule();
        },
        minDelay + Math.random() * (maxDelay - minDelay),
      );
    }

    schedule();
    return () => {
      clearTimeout(wait);
      clearInterval(tick);
    };
  });
</script>

<!-- Every value is stacked invisibly in the same grid cell, so the box always has the width of
     the longest word. The animated text is absolutely positioned: wide random glyphs may overflow
     a little but never resize the box, so the layout does not shift while letters scramble. -->
<!-- The visible text comes first: placed after the sizers, Chrome would read it as the end of
     their word and skip `text-transform: capitalize`. -->
<span aria-hidden="true" class="relative inline-grid whitespace-nowrap">
  <span class="absolute top-0 left-0">{text}</span>
  {#each values as value (value)}
    <span class="invisible col-start-1 row-start-1">{value}</span>
  {/each}
</span>
