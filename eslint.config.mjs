import js from "@eslint/js";
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
    rules: {
      // The site is served from the domain root (no paths.base), and links such as the
      // generated PDF or external contact URLs cannot go through resolve().
      "svelte/no-navigation-without-resolve": "off",
    },
  },
];
