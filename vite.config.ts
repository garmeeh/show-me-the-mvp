import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  // The Worker builds in the ssr environment; cf deploy uploads its source maps.
  environments: {
    ssr: { build: { sourcemap: true } },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src/react-app"),
    },
  },
});
