// Static in production (no app runtime). In dev the page hydrates so Vite HMR reaches it:
// with csr = false SvelteKit ships no Vite client and edits never reload the browser.
import { dev } from "$app/env";

export const csr = dev;
