import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Kept apart from vite.config.ts so tests load neither the Cloudflare nor the
// Tailwind plugin. Each project picks its environment from where its files live.
export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: "api",
          environment: "node",
          include: ["src/worker/**/*.test.ts"],
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            "@": path.resolve(import.meta.dirname, "./src/react-app"),
          },
        },
        test: {
          name: "client",
          environment: "happy-dom",
          include: ["src/react-app/**/*.test.{ts,tsx}"],
          setupFiles: ["./src/react-app/test/setup.ts"],
        },
      },
    ],
  },
});
