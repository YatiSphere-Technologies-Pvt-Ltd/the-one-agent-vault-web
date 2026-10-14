#!/usr/bin/env node
// Bundle budget: initial JS per route must stay under 250 KB compressed (gzip).
// Initial JS for a route = the entry chunk and its static imports, plus every lazily loaded
// route chunk on the way to that route (layout + page) and their static imports.
// Reads apps/console/dist/.vite/manifest.json. No dependencies.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const BUDGET = 250 * 1024;
const dist = fileURLToPath(new URL("../apps/console/dist/", import.meta.url));
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(dist, ".vite/manifest.json"), "utf8"));
} catch {
  console.error("budgets: apps/console/dist/.vite/manifest.json not found. Run `pnpm build` first.");
  process.exit(1);
}

const sizes = new Map();
const gz = (file) => {
  if (!sizes.has(file)) sizes.set(file, gzipSync(readFileSync(join(dist, file)), { level: 9 }).length);
  return sizes.get(file);
};

/** Files loaded by a chunk before it runs: itself and its static imports, recursively. */
function closure(key, seen = new Set()) {
  const chunk = manifest[key];
  if (!chunk || seen.has(key)) return seen;
  seen.add(key);
  for (const dep of chunk.imports ?? []) closure(dep, seen);
  return seen;
}

const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry);
const entry = closure(entryKey);

// Route chunks: files under src/routes, split by the router plugin (component, loaders…).
const routeChunks = Object.keys(manifest).filter((k) => k.includes("src/routes/") && manifest[k].isDynamicEntry);
const byRoute = new Map();
for (const key of routeChunks) {
  const file = key.replace(/\?.*$/, "");
  byRoute.set(file, [...(byRoute.get(file) ?? []), key]);
}

/** Parent route files of a route file (e.g. routes/app/servers/$id/tools.tsx → routes/app.tsx, routes/app/servers/$id.tsx). */
function ancestors(file) {
  const parts = file.replace(/^.*src\/routes\//, "").replace(/\.tsx$/, "").split("/");
  const result = [];
  for (let i = 1; i < parts.length; i++) {
    const candidate = file.replace(/src\/routes\/.*$/, `src/routes/${parts.slice(0, i).join("/")}.tsx`);
    if (byRoute.has(candidate)) result.push(candidate);
  }
  return result;
}

const rows = [];
for (const file of byRoute.keys()) {
  const keys = new Set(entry);
  for (const routeFile of [...ancestors(file), file]) {
    for (const k of byRoute.get(routeFile) ?? []) closure(k, keys);
  }
  const files = new Set([...keys].map((k) => manifest[k].file).filter((f) => f.endsWith(".js")));
  const bytes = [...files].reduce((sum, f) => sum + gz(f), 0);
  rows.push({ route: file.replace(/^.*src\/routes\//, ""), bytes });
}
rows.sort((a, b) => b.bytes - a.bytes);

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
const over = rows.filter((r) => r.bytes > BUDGET);
const entryBytes = [...new Set([...entry].map((k) => manifest[k].file))].reduce((s, f) => s + gz(f), 0);
console.log(`budgets: entry ${kb(entryBytes)} gzip; largest routes:`);
for (const r of rows.slice(0, 5)) console.log(`  ${kb(r.bytes).padStart(9)}  ${r.route}`);
if (over.length > 0) {
  console.error(`\nbudgets: ${over.length} route(s) over ${kb(BUDGET)}:`);
  for (const r of over) console.error(`  ${kb(r.bytes)}  ${r.route}`);
  process.exit(1);
}
console.log(`budgets: all ${rows.length} route chunks under ${kb(BUDGET)} initial JS`);

// ---- Marketing site: all JavaScript the landing page loads must stay under 40 KB compressed. ----
const SITE_BUDGET = 40 * 1024;
const siteDist = fileURLToPath(new URL("../apps/site/dist/", import.meta.url));
let html;
try {
  html = readFileSync(join(siteDist, "index.html"), "utf8");
} catch {
  console.error("budgets: apps/site/dist/index.html not found. Run `pnpm build` first.");
  process.exit(1);
}
const inline = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? "");
const external = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1] ?? "");
const siteBytes =
  inline.reduce((sum, code) => sum + gzipSync(code, { level: 9 }).length, 0) +
  external.reduce((sum, src) => sum + gzipSync(readFileSync(join(siteDist, src.replace(/^\//, ""))), { level: 9 }).length, 0);
console.log(`budgets: site JavaScript ${kb(siteBytes)} gzip (${inline.length} inline, ${external.length} external)`);
if (siteBytes > SITE_BUDGET) {
  console.error(`budgets: site JavaScript over ${kb(SITE_BUDGET)}`);
  process.exit(1);
}
