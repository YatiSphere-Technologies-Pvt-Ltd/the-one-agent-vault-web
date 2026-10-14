import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "tokens",
          environment: "node",
          include: ["packages/tokens/**/*.test.ts"],
        },
      },
      {
        plugins: [react()],
        test: {
          name: "ui",
          environment: "jsdom",
          include: ["packages/ui/src/**/*.test.{ts,tsx}", "apps/console/src/**/*.test.{ts,tsx}"],
          setupFiles: ["packages/ui/src/test/setup.ts"],
        },
      },
    ],
  },
});
