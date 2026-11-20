import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^#lib\/(.*)\.js$/,
        replacement: fileURLToPath(new URL("./src/lib/$1.ts", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
