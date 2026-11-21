import js from "@eslint/js";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import { MatcherType, SelectorKind } from "eslint-plugin-better-tailwindcss/types";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".svelte-kit/", ".next/", "build/", ".vercel/", "node_modules/", "security-reports/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    // Same checks as the Tailwind CSS IntelliSense VS Code extension (canonical classes,
    // conflicts), plus unknown/duplicate/deprecated classes. Class ordering and line wrapping
    // are left out on purpose: they would reformat every template.
    files: ["**/*.svelte", "**/*.ts"],
    plugins: { "better-tailwindcss": betterTailwind },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app.css",
        selectors: [
          ...getDefaultSelectors(),
          // Class strings kept in constants (toolbars, cards, contact lines…).
          {
            kind: SelectorKind.Variable,
            name: "^(action|topAction|topActions|bottomActions|projectCard|contactLine)$",
            match: [{ type: MatcherType.String }],
          },
          {
            kind: SelectorKind.Variable,
            name: "^(levelStyle|toolBorder)$",
            match: [{ type: MatcherType.ObjectValue }],
          },
        ],
      },
    },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        // Plain CSS classes defined in src/app.css or in component <style> blocks.
        { ignore: ["^cv-document$", "^cv-preview$", "^project-dialog$"] },
      ],
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
      "better-tailwindcss/no-unnecessary-whitespace": "error",
    },
  },
  {
    rules: {
      // The site is served from the domain root (no paths.base), and links such as the
      // generated PDF or external contact URLs cannot go through resolve().
      "svelte/no-navigation-without-resolve": "off",
    },
  },
];
