import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Every page is prerendered, so SvelteKit emits the policy as a <meta> tag baked into the
      // HTML. Destinations: the app itself, the Cloudflare beacon and the Turnstile widget. Style
      // attributes cannot be hashed, hence 'unsafe-inline' for styles only.
      // Off in dev: Vite's HMR pipeline injects inline scripts a static policy would block.
      csp:
        command === "build"
          ? {
              mode: "hash",
              directives: {
                "default-src": ["self"],
                "script-src": [
                  "self",
                  "https://challenges.cloudflare.com",
                  "https://static.cloudflareinsights.com",
                ],
                "style-src": ["self", "unsafe-inline"],
                "img-src": ["self"],
                "font-src": ["self"],
                "connect-src": [
                  "self",
                  "https://challenges.cloudflare.com",
                  "https://cloudflareinsights.com",
                ],
                "frame-src": ["https://challenges.cloudflare.com"],
                "frame-ancestors": ["none"],
                "base-uri": ["none"],
                "form-action": ["self"],
                "object-src": ["none"],
              },
            }
          : undefined,
      prerender: {
        handleHttpError: ({ path, message }) => {
          // Generated after the build by scripts/pdf.mjs.
          if (path === "/Erik_Aouizerate_CV.pdf") return;
          throw new Error(message);
        },
      },
      compilerOptions: {
        // Force runes mode outside node_modules.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
    }),
  ],
  // Keep the container port used by docker-compose and the Caddy proxy.
  server: {
    host: process.env.VITE_DEV_HOST ?? "localhost",
    port: 3000,
    strictPort: true,
  },
  preview: { port: 3000, strictPort: true },
}));
