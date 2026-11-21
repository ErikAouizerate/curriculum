import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
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
});
