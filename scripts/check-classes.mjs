#!/usr/bin/env node
// Token-discipline checker. No dependencies. Scans apps/** and packages/ui/** source and fails on:
//   - hex / rgb / hsl colour literals (anywhere in the file)
//   - arbitrary Tailwind values: `-[` in the utility part of a class (variants such as
//     data-[state=open]: are allowed; CSS-variable shorthand such as h-(--av-size-topbar) is allowed)
//   - physical direction classes: ml- mr- pl- pr- left- right- text-left text-right
//     rounded-l- rounded-r- border-l- border-r- (use ms- me- ps- pe- start- end- text-start …)
//   - spacing steps outside 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 on spacing utilities
//     (padding, margin, gap, space, inset/position, translate, scroll margin/padding)
//   - primitive colour names in classes: seal-<step>, rust-, neutral-, night-, ochre-, red-, blue-,
//     tint-dark- (semantic names such as seal-intact are allowed)
//   - dangerouslySetInnerHTML
// Prints file:line for each violation and exits 1 when any are found.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SCAN = ["apps", "packages/ui"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".mdx", ".html", ".astro"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "storybook-static", "public", ".vite", "test-results", "coverage"]);
const SKIP_FILES = [/routeTree\.gen\.ts$/, /\.d\.ts$/];

const ALLOWED_STEPS = new Set(["0", "0.5", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "px"]);
const SPACING_UTILITY =
  /^-?(p|px|py|ps|pe|pt|pb|m|mx|my|ms|me|mt|mb|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|start|end|top|bottom|translate-x|translate-y|scroll-m|scroll-mx|scroll-my|scroll-ms|scroll-me|scroll-mt|scroll-mb|scroll-p|scroll-px|scroll-py|scroll-ps|scroll-pe|scroll-pt|scroll-pb)-(\d+(?:\.\d+)?)$/;
const PHYSICAL =
  /^-?(ml|mr|pl|pr|left|right|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-|^(rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|border-l|border-r)(-|$)|^text-(left|right)$/;
const PRIMITIVE = /(^|-)(seal-(\d|0)|rust-\d|neutral-\d|night-\d|ochre-\d|red-\d|blue-\d|tint-dark-)/;
const COLOUR_LITERAL = /(?<![\w&/-])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?)\s*\(/;
const UNSAFE_HTML = /dangerouslySetInnerHTML/;

/** Strip variants (hover:, data-[state=open]:, [&_svg]:) and the important flag. */
function utilityOf(token) {
  let depth = 0;
  let last = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) last = i;
  }
  return token.slice(last + 1).replace(/^!|!$/g, "");
}

/** Candidate class tokens on a line: words inside string literals and @apply rules. */
function classTokens(line, ext) {
  const tokens = [];
  if (ext === ".css") {
    const apply = /@apply\s+([^;]+);/.exec(line);
    if (apply?.[1]) tokens.push(...apply[1].split(/\s+/));
    return tokens;
  }
  const strings = line.match(/"[^"]*"|'[^']*'|`[^`]*`/g) ?? [];
  for (const s of strings) tokens.push(...s.slice(1, -1).split(/\s+/).filter(Boolean));
  return tokens;
}

function checkToken(token) {
  if (!/^[!-]?[a-z[&@*]/i.test(token)) return null;
  const utility = utilityOf(token);
  if (!utility) return null;
  // `[mask-type:luminance]` is an arbitrary property; `[data-part="x"]` is a CSS selector, not a class.
  if (utility.includes("-[") || /^\[[\w-]+:/.test(utility)) return `arbitrary value "${token}"`;
  if (PHYSICAL.test(utility)) return `physical direction class "${token}" (use logical ms-/me-/ps-/pe-/start-/end-)`;
  const spacing = SPACING_UTILITY.exec(utility);
  if (spacing && !ALLOWED_STEPS.has(spacing[2])) return `spacing step "${token}" is not one of 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16`;
  if (/^-?(bg|text|border|ring|outline|fill|stroke|from|to|via|shadow|decoration|divide|placeholder|caret|accent)-/.test(utility) && PRIMITIVE.test(utility)) {
    return `primitive colour "${token}" (use a semantic token)`;
  }
  return null;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(name)) && !SKIP_FILES.some((re) => re.test(path))) yield path;
  }
}

const violations = [];
for (const base of SCAN) {
  const dir = join(root, base);
  try {
    statSync(dir);
  } catch {
    continue;
  }
  for (const file of walk(dir)) {
    const ext = extname(file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      const where = `${relative(root, file)}:${index + 1}`;
      if (COLOUR_LITERAL.test(line)) violations.push(`${where}  colour literal (use a token)`);
      if (UNSAFE_HTML.test(line)) violations.push(`${where}  dangerouslySetInnerHTML (render untrusted text with SafeText)`);
      for (const token of classTokens(line, ext)) {
        const problem = checkToken(token);
        if (problem) violations.push(`${where}  ${problem}`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`check-classes: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log("check-classes: 0 violations");
