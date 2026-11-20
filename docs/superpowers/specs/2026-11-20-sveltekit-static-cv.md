# SvelteKit static CV with a hash-addressable editor

Status: implemented
Date: 2026-11-20

## Context

The site was a single Next.js App Router page with `"use client"` at the page level:
the whole CV, the zustand store, every icon and every data module were shipped to the
browser and re-rendered during hydration. The "edit mode" (`?edit`) lived on the same
route as the public CV, so the public page could not be rendered without the client
runtime.

Two goals drove this rewrite:

1. The public CV must be plain static HTML with no application JavaScript.
2. A dynamic webapp part (CV editor now, more modules later) must stay possible on the
   same site.

## Decisions

| Topic | Decision |
| --- | --- |
| Framework | SvelteKit 3 + Svelte 5, `adapter-vercel`, every route prerendered |
| Public CV | `/` uses `prerender = true` and `csr = false` → no framework JavaScript; only `cv.js` and the Cloudflare beacon |
| Editor | `/studio`, hydrated, state encoded in the URL fragment |
| State format | `#cv=<24 base64url chars>`, versioned bit field |
| Undo | Browser history (`pushState` / `popstate`), no custom history stack |
| PDF | Generated at build with Playwright, from the prerendered `/` output |
| Deployment | GitHub Actions → `vercel deploy --prebuilt --prod` |
| Content | Typed TypeScript modules, ISO `YYYY-MM` dates |
| Analytics | Cloudflare Web Analytics, injected at build from the `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` GitHub Actions variable |

SvelteKit was chosen over Astro because the target is a webapp with many interactive
modules: SvelteKit provides routing, layouts, shared state and client navigation, while
still allowing a per-page zero-JavaScript MPA (`prerender = true` + `csr = false`).

## Architecture

```
src/
  app.html                         # HTML shell (Cloudflare beacon, cv.js)
  app.css                          # Tailwind v4 + Inter
  routes/
    +layout.js                     # prerender = true
    +layout.svelte                 # global styles
    +page.js                       # csr = false
    +page.svelte                   # static CV (no JS)
    studio/+page.svelte            # editor (hydrated)
  lib/
    content/
      types.ts                     # Skill, Job, School, label types
      labels.ts                    # canonical label dictionary
      profile.ts                   # header, contact, summary
      schools.ts
      jobs.ts
      skills/{dev,ia,devops,cloud}.ts
      tools.ts                     # job badge ordering and categories
    cv.ts                          # default state, view model, actions, tool matching
    cv-codec.ts                    # encode/decode the URL fragment payload
    cv-hash.ts                     # read/write `#cv=…`
    components/                    # presentational only, no state
      CvDocument.svelte
      CvHeader.svelte
      CvSection.svelte
      CvSkill.svelte
      CvJob.svelte
scripts/pdf.mjs                    # serve the build output, print `/` to PDF
```

Dependency rule: `src/lib/components/**` and `src/lib/content/**` must not import
browser APIs or the editor state. They receive a view model through props. This is what
allows the same components to be rendered by the static page and by the editor.

## State model

```ts
type JobMode = 0 | 1 | 2; // hidden | complete | small

interface CvState {
  jobs: JobMode[];    // 14 entries, same order as content/jobs.ts
  skills: boolean[];  // 75 entries: dev, ia, devops, cloud, in that order
}
```

Bit layout, most significant first:

| Field | Bits |
| --- | --- |
| Version | 4 |
| Jobs | 2 × 14 = 28 |
| Skills | 1 × 75 = 75 |
| **Total** | **107** |

The payload is encoded as one BigInt in base64url and left-padded to **24 characters**
(144 bits), which leaves 37 bits of headroom. `decodeCv` returns `null` for a malformed
code or an unknown version instead of producing a wrong CV. `encodeCv` throws if the
state exceeds the capacity: no silent truncation.

The version must be bumped whenever the job or skill catalogs change order or size;
older links then fall back to the default CV.

## Rendering

- `/` is prerendered and never hydrated. It does not load the SvelteKit app runtime. Two scripts
  are allowed: `static/cv.js`, a small vanilla click delegation for share/print, and the Cloudflare
  Web Analytics beacon rendered by the layout only when `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` is set. Interactive affordances are the share/print buttons, the PDF download and
  a top-right arrow to `/studio` (currently visually hidden, with a 56×56 clickable area kept).
- `/studio` is prerendered as a skeleton and hydrates. On mount it reads the hash,
  decodes it, and renders the editor. Every action writes a new state to the hash with
  `pushState`; `popstate` re-reads it. The undo button calls `history.back()`.
- Missing or invalid code → default CV, and the hash is replaced with the encoded
  default so the URL is always shareable.

## PDF and deployment

`pnpm build` produces `.vercel/output/static` through `@sveltejs/adapter-vercel`
(every route is prerendered; only a catch-all function remains for unknown paths).
`pnpm pdf` serves that directory with a dependency-free Node server, prints `/` with
Playwright as A4 with backgrounds and CSS page size, and writes `Erik_Aouizerate_CV.pdf`
next to the static assets. CI compresses it with Ghostscript (`/ebook`) before upload and
deployment.

GitHub Actions:

- pull request: install, check, lint, test, build, PDF (artifact only);
- push to `main`: same, then `vercel pull`, `vercel build --prod`, PDF, and
  `vercel deploy --prebuilt --prod`.

The Vercel Git integration must be disabled, otherwise each push triggers two
deployments. Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## Verification

1. `pnpm test` — codec round-trip, saturation, invalid input; content validation.
2. `pnpm check` — types across Svelte and TypeScript files.
3. `pnpm build` and `.vercel/output/static/index.html` does not reference
   `_app/immutable/nodes` (CI enforces this).
4. `pnpm pdf` — non-zero page count, text content matches the CV.
5. `/studio#cv=<code>` reloads the same selection; Back undoes the last action.

## Consequences

- React, Next.js, zustand and immer are removed; the editor logic is expressed with
  Svelte runes.
- The "years old" and experience lines are computed at build time on `/`; they refresh
  on the next deployment.
- The static page keeps share/print/download buttons through `static/cv.js`, outside the
  framework runtime. The generated PDF is compressed in CI. Analytics is opt-in through a build-time
  environment variable and never committed.
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` should be used for local installs; CI installs
  Chromium explicitly.
