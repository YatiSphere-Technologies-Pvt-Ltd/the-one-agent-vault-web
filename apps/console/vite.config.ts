import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ command, mode }) => {
  // VITE_MOCK_API=true: a production build that runs on the seeded mock API (demo deployments).
  const mockApi = loadEnv(mode, process.cwd(), "VITE_").VITE_MOCK_API === "true";
  return {
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    react(),
    tailwindcss(),
  ],
  // The MSW worker lives in public/; it ships only in development or mock-API builds.
  publicDir: command === "serve" || mockApi ? "public" : false,
  build: {
    manifest: true,
    target: "es2022",
  },
  server: { port: 5173 },
  preview: { port: 4173 },
  };
});
