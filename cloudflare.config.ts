import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "mvp-what",
    compatibilityDate: "2025-10-08",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/worker/index.ts",
    observability: {
      enabled: true,
    },
    // Static assets are the Vite client build; unmatched routes fall back to the SPA.
    assets: {
      notFoundHandling: "single-page-application",
    },
    env: {
      // Vercel AI Gateway key. Local dev reads it from .dev.vars.
      AI_GATEWAY_API_KEY: bindings.secret(),
    },
  },
});
