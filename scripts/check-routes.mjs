#!/usr/bin/env node
// The generated route tree is @ts-nocheck, so a route parented to a route that was never created
// (a router-generator edge case) compiles fine and only fails at runtime as "Page not found".
// This fails the build instead. Run after the console build (which regenerates the tree).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../apps/console/src/routeTree.gen.ts", import.meta.url));
const tree = readFileSync(file, "utf8");
const defined = new Set([...tree.matchAll(/^const (\w+) = /gm)].map((m) => m[1]));
defined.add("rootRouteImport");
const missing = [...new Set([...tree.matchAll(/getParentRoute: \(\) => (\w+)/g)].map((m) => m[1]))].filter(
  (name) => !defined.has(name),
);
if (missing.length > 0) {
  console.error(`check-routes: route tree references undefined parent route(s): ${missing.join(", ")}`);
  console.error("  Add a layout route file for that folder (e.g. routes/<folder>.tsx).");
  process.exit(1);
}
console.log(`check-routes: ${defined.size - 1} routes, all parents defined`);
