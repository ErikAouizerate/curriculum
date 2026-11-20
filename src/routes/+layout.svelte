<script lang="ts">
  import "../app.css";
  import { PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN } from "$app/env/public";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const cloudflareToken = PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
</script>

<svelte:head>
  <title>CV Érik Aouizerate</title>
  <meta
    name="description"
    content="Site personnel d'Erik Aouizerate. Curriculum interactif. Contact pour mission freelance."
  />
  <link rel="describedby" type="text/markdown" href="/llms.txt" />
  <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="CV in Markdown" />
  {#if cloudflareToken}
    <script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: cloudflareToken })}
    ></script>
  {/if}
</svelte:head>

{@render children()}
