import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Canonical origin for SEO tags and the sitemap: SITE_URL, else the Vercel production URL,
// else the placeholder domain.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "https://agentvault.dev");

export default defineConfig({
  site,
  output: "static",
  // React renders shared @agentvault/ui components to HTML at build time; no React ships to the browser.
  integrations: [react()],
  build: { inlineStylesheets: "auto" },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
