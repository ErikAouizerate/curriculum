import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: {
    public: true,
    static: true,
    // Optional: undefined keeps the Cloudflare beacon out of the build.
    schema: (value) => value,
  },
});
